
angular.module('archeryGameApp', [])

.controller("gameController", function ($scope, $interval) {

    $scope.Message = "";
    $scope.score = 0;
    $scope.remainingBullets = 10;
    $scope.countDown = 500;
    $scope.isGameOver = false;

    $scope.cnv = document.getElementById('myCanvas');
    $scope.ctx = $scope.cnv.getContext('2d');

    $scope.deg = Math.PI / 180;

    $scope.targets = [];

    $scope.currentGunY = 0;

    $scope.bulletX = 0;
    $scope.spx;
    $scope.shoots = 0;
    $scope.ply = 1;
    $scope.sh = new Array;
    $scope.xO = new Array(); $scope.yO = new Array();
    $scope.xn = new Array(); $scope.yn = new Array();
    $scope.xi = new Array(); $scope.yi = new Array();

    $scope.targetX = 250;
    $scope.targetY = 50;
    $scope.targetR = 5;


    $scope.spx = 10
   
    // draw our target (red circle)
    $scope.drawTarget = function (x, y) {
        $scope.ctx.beginPath();
        $scope.ctx.arc(x, y, $scope.targetR, 0, Math.PI * 2);
        $scope.ctx.fillStyle = "red";
        $scope.ctx.fill();

        $scope.ctx.closePath();
    }

    // remove the canvas object
    $scope.removeTarget = function (x, y) {
        $scope.ctx.beginPath(); 
        $scope.ctx.clearRect(x - $scope.targetR, y - $scope.targetR, 2 * $scope.targetR, 2 * $scope.targetR);
        $scope.ctx.closePath();
    }

    // Gun movement - translate with no rotate
    $scope.gunTransalte = function (event) {

        var bb, x1, y1, x, y;

        bb = $scope.cnv.getBoundingClientRect();
        var mouseY = (event.clientY - bb.top) * ($scope.cnv.height / bb.height);
        //mouseY -= 114;
        if (event != null) {
            x1 = 250;
            y1 = 115;
        } else {
            x1 = 250;
            y1 = 115;
        }

        var a, b, AA, BB, CC, Del, x0 = 10, y0 = 115, r = 30, teta, fi, fi2, dx, dy;

        //$scope.ctx.beginPath();
        //$scope.ctx.clearRect(0, 15, r + 15, 150);
        //$scope.ctx.strokeStyle = "blue";
        //$scope.ctx.lineWidth = 5;
        //$scope.ctx.stroke();
        ////$scope.ctx.strokeRect(10, 10, 380, 210)
        //$scope.ctx.strokeRect(10, 10, 280, 160);
        //$scope.ctx.closePath();

        $scope.ctx.beginPath();
        $scope.ctx.moveTo(0, 0);
        $scope.ctx.moveTo(0, mouseY);
        $scope.ctx.lineTo(20, mouseY);
        $scope.ctx.strokeStyle = "darkblue"
        $scope.ctx.lineWidth = 2.5
        $scope.ctx.stroke()
        $scope.ctx.closePath();

        $scope.currentGunY = mouseY;
    }

    $scope.shoot = function(event) {
        $scope.remainingBullets--;

        $scope.bulletX = 0;
        $interval($scope.shootStraightOnce, 2, 40);
    }


    $scope.shootOnce = function() {
        var a, b, AA, BB, CC, Del, x0 = 10, y0 = 115, r = 30, teta, fi, fi2, dx, dy;

        for (ind = 0; ind < $scope.shoots; ind++) {
            x0 = 10; y0 = 115
            $scope.ctx.translate(x0, y0)
            x1 = $scope.xi[ind] - x0
            y1 = $scope.yi[ind] - y0
            x0 = 0
            y0 = 0
            a = (y1 - y0) / (x1 - x0)
            b = -a * x0 + y0
            if ($scope.xO[ind] != 0 && $scope.xO[ind] < 360) {
                $scope.ctx.translate($scope.xO[ind], $scope.yO[ind])
                $scope.ctx.rotate(teta)
                $scope.ctx.clearRect(-3, -6, r + 3, 12)
                $scope.ctx.rotate(-teta)
                $scope.ctx.setTransform(1, 0, 0, 1, 0, 0)
                $scope.ctx.strokeStyle = "blue"
                $scope.ctx.lineWidth = 5
                $scope.ctx.strokeRect(10, 10, 380, 210)
                $scope.ctx.translate(10, 115)
            }

            teta = Math.atan(y1 / x1)
            if ($scope.xO[ind] == 0)
                $scope.xO[ind] = r * Math.cos(teta) + 4
            else
                if ($scope.xn[ind] < 377 && $scope.yn[ind] > -102 && $scope.yn[ind] < 102) $scope.xO[ind] += $scope.spx * Math.cos(teta)
            $scope.yO[ind] = a * $scope.xO[ind] + b
            $scope.xn[ind] = $scope.xO[ind] + r * Math.cos(teta)
            $scope.yn[ind] = a * $scope.xn[ind] + b
            $scope.ctx.beginPath()
            $scope.ctx.moveTo($scope.xO[ind], $scope.yO[ind])
            $scope.ctx.lineTo($scope.xn[ind], $scope.yn[ind])
            $scope.ctx.strokeStyle = "red";
            $scope.ctx.lineWidth = 1.5;
            $scope.ctx.stroke();
            $scope.ctx.closePath();
            $scope.ctx.setTransform(1, 0, 0, 1, 0, 0);

            if (isCollide($scope.xO[ind], $scope.yO[ind], $scope.xn[ind], $scope.yn[ind])) {

            }
        }
    }

    

    $scope.shootStraightOnce = function () {
        $scope.ctx.beginPath();
        if ($scope.bulletX >= 40)
        {
            $scope.ctx.clearRect($scope.bulletX - 20, $scope.currentGunY - 5, 20, 10);
        }
        $scope.ctx.moveTo( $scope.bulletX, $scope.currentGunY);
        $scope.bulletX += 7;
        $scope.ctx.lineTo( $scope.bulletX, $scope.currentGunY);
        $scope.ctx.strokeStyle = "red";
        $scope.ctx.lineWidth = 1.5;
        $scope.ctx.stroke();
        $scope.ctx.closePath();

        if (isCollide()) {

        }
    }

    function generateTarget() {
        $scope.targetX = 250;
        $scope.targetY = Math.floor((Math.random() * 120) + 20);
        
        $scope.targetEngine = $interval(function () {
            $scope.removeTarget($scope.targetX, $scope.targetY);
            $scope.targetX -= 10;
            if ($scope.targetX < 0) {
                $interval.cancel($scope.targetEngine);

                generateTarget();
            }
            else {
                $scope.drawTarget($scope.targetX, $scope.targetY);
            }
            
        }, 200, 40)
    }

    function isCollide() {
        if ($scope.bulletX >= ($scope.targetX - $scope.targetR) && $scope.bulletX <= ($scope.targetX + $scope.targetR) && $scope.currentGunY >= ($scope.targetY - $scope.targetR) && $scope.currentGunY <= ($scope.targetY + $scope.targetR)) {

            $scope.removeTarget($scope.targetX, $scope.targetY);
            $scope.Message = "Yes, You shooted the target !!!";
            $scope.score++;
            $interval.cancel($scope.targetEngine);

            generateTarget();
        }
    }

    function gameOver() {
        $scope.isGameOver = true;
        $interval.cancel($scope.gameTimer);
        $interval.cancel($scope.targetEngine);
    }

    generateTarget();

    $scope.gameTimer = $interval(function () {
        $scope.countDown--;

        if ($scope.countDown < 0) {
            gameOver();
            
        }
    }, 100)
});

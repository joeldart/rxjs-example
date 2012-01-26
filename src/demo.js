(function () {

    var Observable = Rx.Observable;
    
    function subscribeToDrag() {
        var redRect = document.getElementById("redRect"),
        
            mouseDown = Observable.fromEvent(redRect, "mousedown"),
            mouseMove = Observable.fromEvent(document, "mousemove").select(function (e) {
                return {
                   x: e.clientX,
                   y: e.clientY
                };
            }),
            mouseUp = Observable.fromEvent(document, "mouseup"),
            
            drag = mouseDown.selectMany(function (d) {
                return mouseMove.skip(1).zip(mouseMove, function (l,r) {
                    return {
                        dx: l.x - r.x,
                        dy: l.y - r.y
                    };
                 }).takeUntil(mouseUp);
            });
            
            drag.subscribe(function (delta) {
                var x = parseInt(redRect.style.left, 10),
                    y = parseInt(redRect.style.top, 10);
                    redRect.style.left = (x + delta.dx) + "px";
                    redRect.style.top = (y + delta.dy) + "px";
            });
    }
    
    
    
    
    
    
    
    
    
    
    
    
    function subscribeToKonami() {
        var keys = {
                up: 38,
                down: 40,
                left: 37,
                right: 39,
                b: 66,
                a: 65
            },
            theTextBox = document.getElementById("theTextBox"),
            
            keyUp = Observable.fromEvent(theTextBox, "keyup"),
            
            keyIs = function (key) {
                return keyUp.where(function (k) { 
                    return k.keyCode === key; 
                });
            },
            keyIsNot = function (key) {
                return keyUp.where(function (k) { return k.keyCode !== key; });
            },
            
           /* konamiCode = keyIs(key.up).selectMany(function () {
                return keyIs(key.up).selectMany(function () {
                
                }).TakeUntil(keyIsNot(key.up);
            });*/
            konamiCode = keyIs(keys.up).selectMany(function () {
                return keyIs(keys.up).selectMany(function () {
                    return keyIs(keys.down).selectMany(function () {
                        return keyIs(keys.down).selectMany(function () {
                            return keyIs(keys.left).selectMany(function () {
                                return keyIs(keys.right).selectMany(function () {
                                    return keyIs(keys.left).selectMany(function () {
                                        return keyIs(keys.right).selectMany(function () {
                                            return keyIs(keys.b).selectMany(function () {
                                                return keyIs(keys.a);
                                            });
                                        });
                                    });
                                });
                            });
                        });
                    });
                });
            });
            
            konamiCode.subscribe(function () {
                alert("Konami code entered!");
            });

    }




    window.addEventListener("load", function () {

     subscribeToDrag();   
     subscribeToKonami();
        
        
    });
}());
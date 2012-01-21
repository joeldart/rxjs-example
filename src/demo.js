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




    window.addEventListener("load", function () {

     subscribeToDrag();   
        
        
    });
}());
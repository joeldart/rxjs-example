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
        //unrelated to rest of example 
        document.getElementById("redRect").style.cssText="display:none;";
        //nothing to see here, carry on...
        
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


    function subscribeToTranslation() {
        /* this example came from Matthew Podwysocki's blog and then I ported it to c# for a different demo and now a,
         * porting it back to javascript... but I thought it did too good of a job showing how to 
         * use Subjects to create your own IObservables and is obviously very cool.  To read his excellent
         * explanation, go to http://codebetter.com/blogs/matthew.podwysocki/archive/2010/03/11/introduction-to-the-reactive-extensions-for-javascript-composing-callbacks.aspx
         * though keep in mind the code is for a deprecated version of rxjs (pre js idioms for example)
        */
        
        document.getElementById("redRect").style.cssText="display:none;";
        //once again nothing to see
        
        var theTextBox = document.getElementById("theTextBox"),
            translationBox = document.getElementById("translationBox"),
            
            textChanged = Observable.fromEvent(theTextBox, "keyup").throttle("250").select(function () {
                return theTextBox.value;
            }),
            
            translator = textChanged
                .where(function(textToDetect) {
                    //only detect language of non-empty strings
                    return !!textToDetect
                })
                .selectMany(function (textToDetect) {
                    return detect(textToDetect).selectMany(function (language) {
                       return translate(textToDetect, language, "es"); 
                    });
                });
        
        translator.subscribe(function (spanishText) {
            var span = document.createElement("span");
            span.innerHTML = spanishText;/*security warning: demo code only*/
            translationBox.appendChild(span);
        });
        
        
        function detect (text) {
            //Subjects are both IObservable and IObserver.  
            //AsyncSubjects act like the Promise API and will 
            //both report and replay observed values
            var subject = new Rx.AsyncSubject(),
                uri = "/detect/" + encodeURIComponent(text);
                
            $.get(uri).then(function (data) {
                subject.onNext(data);
                subject.onCompleted();
            }, function (err) {
                subject.onError(err);
            });
            
            return subject;
        }
        
        function translate (text, from, to) {
            var subject = new Rx.AsyncSubject(),
                uri = ["/translate", encodeURIComponent(text), from, to].join("/");
            
            $.get(uri).then(function (data) {
                subject.onNext(data);
                subject.onCompleted();
            },
            function (err) {
                subject.onError(err);
            });
                
            return subject;
        }
        
    }



    window.addEventListener("load", function () {

     subscribeToDrag();   
     //subscribeToKonami();
     subscribeToTranslation();
        
    });
}());
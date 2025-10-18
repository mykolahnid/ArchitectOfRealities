(function(){
    const seq = [38,38,40,40,37,39,37,39,66,65]; // up up down down left right left right b a
    const keys = [];
    window.addEventListener("keydown", e => {
        keys.push(e.keyCode);
        if (keys.length > seq.length) keys.shift();
        if (seq.every((v, i) => v === keys[i])) {
            window.location.href = "/architect";
        }
    });
})();

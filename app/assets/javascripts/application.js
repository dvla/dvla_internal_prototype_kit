function go(url){
    window.location.href = url;
}

// $('button, a, input[type=submit]').bind('validate', (event) => {
//     event.preventDefault();

// })

$.fn.validate = function(cb){
    $(this).click(function(){
        cb();
        return false;
    })
};
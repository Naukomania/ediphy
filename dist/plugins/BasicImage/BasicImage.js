var BasicImage = (function(){
    return {
        init: function () {
            Dali.API.addMenuButton({
                name: 'BasicImage',
                category: 'image',
                callback: this.launch
            })
        },
        launch: function(){
            Dali.API.openConfig().then(function (div) {
                $(div).load('plugins/BasicImage/BasicImage.html');
            });
        }
    }
})();

function imageClick() {
    alert("Miau!");
}
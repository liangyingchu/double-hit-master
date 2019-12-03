
function Main() {
    this.layerList = []
    // 创建一个渲染器并启动
    this.canvasItem = document.getElementById('canvas_game')
    this.renderer = new MONKEY.Renderer({ canvas: this.canvasItem })
    this.renderer.begin()
}

// 创建并添加页面场景
Main.prototype.init = function () {

    this.beginLayer = new BeginLayer(this)
    this.gameLayer = new GameLayer(this)
    this.scoreLayer = new ScoreLayer(this)

    this.layerList.push(this.beginLayer, this.gameLayer, this.scoreLayer)
    this.renderer.add(this.beginLayer.scene, this.gameLayer.scene, this.scoreLayer.scene)
}

Main.prototype.gotoLayer = function (layer) {
    for (var i = 0; i < this.layerList.length; i++) {
        this.layerList[i].scene.visible = false
    }

    switch (layer) {
        case 'begin':
            this.beginLayer.initLayer()
            this.beginLayer.scene.visible = true
            break
        case 'game':
            this.gameLayer.initLayer()
            this.gameLayer.scene.visible = true
            break
        case 'score':
            this.scoreLayer.initLayer()
            this.scoreLayer.scene.visible = true
            break
    }
}

// 播放音乐
Main.prototype.playMusic = function (name) {
    MONKEY.Audio.audios[name].currentTime = 0
    MONKEY.Audio.play(name)
}
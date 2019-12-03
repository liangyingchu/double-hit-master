
function BeginLayer(_parent) {
    this.parent = _parent
    this.scene = new MONKEY.Scene({ background: 'images/beginBg.png' })
    this.init()
}

BeginLayer.prototype.init = function () {
    var self = this

    var beginGridArr = []
    MONKEY.Loader.loadAniImg(beginGridArr, 'images/animation/beginGrid/beginGrid_', 6, 1)
    var beginGridAni = new MONKEY.IntervalAnimation({ frameArray: beginGridArr, autoPlay: true, intervalStatus: true })

    var beginMask = new MONKEY.Animal({ background: 'images/sth/beginMask.png' })

    var btnArr = MONKEY.Labeler.createImage('images/btn/beginBtn.png', 'images/btn/practiceBtn.png', 'images/btn/readmeBtn.png')
    this.btnAni = new MONKEY.IntervalAnimation({ frameArray: btnArr, x: 56, y: 35, ghost: true })

    var btnBg = new MONKEY.Animal({
        background: 'images/sth/btnBg.png',
        x: 400,
        y: 500,
        listenerStatus: true,
        trigger: [[30,15],[240,15],[240,78],[30,78]]
    })
    btnBg.addListener('mousedown', function (e, data) {
        // 开始游戏
        self.parent.gotoLayer('game')
    }, true)
    btnBg.add(this.btnAni)

    var upBtnArr = MONKEY.Labeler.createImage('images/btn/upBtn.png', 'images/btn/upBtn_mo.png')
    var upBtn = new MONKEY.Button({ upImg: upBtnArr[0], moveImg: upBtnArr[1], x: 515, y: 500, zIndex: 10 })
    upBtn.addListener('mousedown', function () {
        MONKEY.pointer.stopPropagation()
        self.btnAni.gotoAndStop(self.btnAni.currentFrame > 1 ? 0 : self.btnAni.currentFrame + 1)
    }, true)

    this.scene.add(beginGridAni, beginMask, btnBg, upBtn)
}

BeginLayer.prototype.initLayer = function () {
    var self = this
}
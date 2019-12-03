
function GameLayer(_parent) {
    this.parent = _parent
    this.scene = new MONKEY.Scene({ background: 'images/gameBg.png' })
    this.clocker = new MONKEY.Clock() // 创建时钟类

    this.musicData = []
    this.stepStatus = [0, 0, 0, 0] // 按钮组的状态 - 0:默认 1:down
    this.speed = 1 // 速度
    this.step = 0 // musicData 数据行索引
    this.keyArr = [] // 四列坠落方块集合数组
    this.keyTarget = -1 // 当前指定的坠落方块的 number
    this.between = 40 // 设置坠落方块高度值的参数

    this.init()
}

GameLayer.prototype.init = function () {
    var self = this

    // 记分牌
    this.gameMask = new MONKEY.Animal({ background: 'images/sth/gameMask.png', zIndex: 50, ghost: true })

    // 得分
    var scoreArr = MONKEY.Labeler.createImage('images/animation/scoreBg/scoreB_1.png', 'images/animation/scoreBg/scoreB_2.png')
    var scoreAni = new MONKEY.IntervalAnimation({ frameArray: scoreArr, x: 425, intervalStatus: true, autoPlay: true, cycle: 800, zIndex: 51 })
    this.score = new MONKEY.Text({
        txt: '0',
        font: 'bold 65px 華康新綜藝體',
        fillStyle: '#fff',
        textAlign: 'center',
        x: 85,
        y: 260
    })
    scoreAni.add(this.score)

    // 四个操作按钮
    var btnArr = ['redBtn', 'greenBtn', 'blueBtn', 'yellowBtn'] // 按钮组
    var lArr = [57, 255, 626, 826] // 按钮组的 x 坐标
    for (var i = 0; i < btnArr.length; i++) {
        var imgArr = MONKEY.Labeler.createImage('images/btn/' + btnArr[i] + '.png', 'images/btn/' + btnArr[i] + '_mo.png')
        var btn = new MONKEY.Button({
            upImg: imgArr[0],
            downImg: imgArr[1],
            x: lArr[i],
            y: 610,
            zIndex: 60
        })
        btn.setAttr('type', i)
        btn.addListener('mousedown', function () {
            var type = this.getAttr('type')
            self.stepStatus[type] = 1
        })
        btn.addListener('mouseup', function () {
            var type = this.getAttr('type')
            self.stepStatus[type] = 0
        })
        var arrow = new MONKEY.Animal({ name: 'arrow', background: 'images/btn/upBtn.png', x: 53, y: -25 })
        btn.add(arrow)
        this.scene.add(btn)
    }

    // 加速按钮
    var speedBtnArr = MONKEY.Labeler.createImage('images/btn/upBtn.png', 'images/btn/upBtn_mo.png')
    this.addSpeedBtn = new MONKEY.Button({
        upImg: speedBtnArr[0],
        moveImg: speedBtnArr[1],
        downImg: speedBtnArr[1],
        zIndex: 60,
        x: 490,
        y: 620
    })
    this.speedText = new MONKEY.Text({
        txt: 'X 1.0',
        textAlign: 'center',
        x: 510,
        y: 660,
        zIndex: 65,
        fillStyle: 'red',
        font: 'bold 20px Arial'
    })
    this.addSpeedBtn.addListener('mousedown', function () {
        var nspeed = parseFloat(MONKEY.Math.add(self.speed, 1))
        if(nspeed > 5) return
        self.speedText.setText('X ' + nspeed)
        self.speed = nspeed
    })

    // 反馈提示
    this.goodTips = new MONKEY.Animal({ background: 'images/sth/goodTips.png', x: 57, y: 600, zIndex: 70, ghost: true, visible: false })

    this.initKeyElm()

    this.scene.add(this.gameMask, scoreAni, this.addSpeedBtn, this.speedText, this.goodTips)

}

// 加载步骤数据
GameLayer.prototype.loadStepData = function() {
    if(this.step > this.musicData.length - 1) return true

    var data = this.musicData[this.step]
    var status = this.pushMusicKey(data)
    this.step++
    return status
}

// 渲染一行坠落方块
GameLayer.prototype.pushMusicKey = function(data) {
    var status = false
    for (var i = 0; i < 4; i++) {
        var index = i * 2 // 0 2 4 6
        if(data[index]) {
            status = true
            var n = data[index + 1]
            this.between = 40
            var len = n * (this.between + 25) + 25 // 坠落方块的高度

            // 获取一个当前列未在坠落中的方块，并初始化设值
            var ani = null
            var arr = this.keyArr[i]
            for (var j = 0; j < arr.length; j++) {
                if(!arr[j].getAttr('run')) {
                    ani = arr[j]
                }
            }
            if(ani) {
                ani.special.height = len
                ani.position.y = 0 - len
                ani.setAttr('run', true)
                ani.setAttr('status', false)
                ani.setAttr('score', n + 1)
                ani.setAttr('addScore', false)
                this.keyTarget = ani.getAttr('number')
            }
        }
    }
    if(!status) this.between += 65
    return status
}

// 创建并初始化四列坠落方块组
GameLayer.prototype.initKeyElm = function() {
    var self = this
    var colorArr = ['#ED3838', '#9AE64C', '#44CCCC', '#FFBE33'] // 坠落方块四款色值
    var xArr = [85, 285, 655, 855] // 坠落方块四个 x 坐标
    
    for (var i = 0; i < 4; i++) {
        var temp = []
        for (var j = 0; j < 10; j++) {
            // 创建圆角矩形（坠落方块）
            var ani = new MONKEY.RectangleRoundGraphics({
                x: xArr[i],
                y: 1000,
                zIndex: 40,
                strokeStyle: colorArr[i],
                fillStatus: true,
                fillStyle: colorArr[i],
                width: 90,
                height: 15,
                radius: 5,
                shadow: true,
                shadowColor: '#000',
                shadowBlur: 5,
                shadowOffsetY: 5
            })
            ani.setAttr('number', i * 10 + j) // 相当于坠落方块Id
            ani.setAttr('status', false)
            ani.setAttr('run', false) // 坠落状态
            ani.setAttr('score', 0) // 坠落方块分值
            ani.setAttr('addScore', false) // 方块是否已被用于加分
            // 绑定自运行函数
            ani.addMotionFunc('move', function () {
                if(!this.getAttr('run')) return

                // 当方块正在坠落时（run 为 true）
                var y = this.position.y
                var number = this.getAttr('number')

                if(self.keyTarget == number && !this.getAttr('status')) {
                    // 当 keyTarget 指定为当前方块的 number 且当前方块的 status 为 false 时

                    if(y > self.between && self.loadStepData()) {
                        // 当前坠落方块坠落至可视区域，且成功设值坠落方块
                        this.setAttr('status', true)
                    }

                    if(y > 720 && this.getAttr('run') && self.step >= self.musicData.length - 1 ) {
                        // 游戏通关
                        self.parent.gotoLayer('score')
                    }

                }

                // 坠落方块还未被点击
                if(!this.getAttr('addScore')) {
                    var ph = this.special.height + y

                    if((y < 585 && ph > 585) || (y < 610 && ph > 610)) {
                        // 坠落方块坠落至操作按钮区域时
                        var index = parseInt(number / 10)
                        if(self.stepStatus[index]) {
                            self.addScore(this.getAttr('score'), index)
                            this.setAttr('addScore', true)
                        }
                    }

                    if(y > 610 && this.getAttr('run')) {
                        // 坠落方块超过操作按钮区域，游戏结束
                        self.parent.gotoLayer('score')
                    }
                }

                this.position.y = y + 2 * self.speed
                if(this.position.y > 750) {
                    this.setAttr('run', false)
                }

            })

            this.scene.add(ani)
            ani.setAttr('run', false)
            temp.push(ani)
        }
        this.keyArr.push(temp)
    }
}

// 得分
GameLayer.prototype.addScore = function(score, index) {
    var self = this
    var lArr = [57, 255, 630, 830]
    var nowScore = parseInt(this.score.getText()) + score * this.speed
    this.score.setText(nowScore.toString())
    this.goodTips.position.x = lArr[index]
    this.goodTips.visible = true
    setTimeout(function () {
        self.goodTips.visible = false
    }, 250)
}

// 初始化页面数据
GameLayer.prototype.initLayer = function () {
    this.step = 0
    this.musicData = musicData['testMusic']
    this.clocker.resetClock() // 重置时钟
    this.loadStepData()
}

GameLayer.prototype.getScore = function () {
    return this.score.getText()
}
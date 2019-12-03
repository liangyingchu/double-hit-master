
function ScoreLayer(_parent) {
    this.parent = _parent
    this.scene = new MONKEY.Scene({ background: 'images/beginBg.png' })
    this.scoreListArr = []
    this.init()
}

ScoreLayer.prototype.init = function () {
    var scoreBg = new MONKEY.Animal({ background: 'images/scoreBg.png' })
    this.score = new MONKEY.Text({
        txt: '0',
        font: 'bold 50px Arial',
        fillStyle: 'red',
        textAlign: 'center',
        x: 500,
        y: 400
    })

    for (var i = 0; i < 3; i++) {
        var scoreList = new MONKEY.Animal({ 
            background: 'images/sth/scoreList_' + (i + 1) + '.png',
            x: 300,
            y: 135 + i * 65,
            zIndex: 10
        })
        var nTxt = new MONKEY.Text({
            name: 'score',
            txt: '0',
            font: '37px Arial',
            fillStyle: '#fff',
            textAlign: 'center',
            x: 340,
            y: 10
        })
        scoreList.add(nTxt)
        this.scoreListArr.push(scoreList)
        this.scene.add(scoreList)
    }
    
    this.scene.add(scoreBg, this.score)
}

ScoreLayer.prototype.initLayer = function () {
    var nowScore = parseInt(this.parent.gameLayer.getScore())
    this.score.setText(nowScore.toString())
    var cookieScore = MONKEY.Cookie.getCookie('ljds')

    if(cookieScore) {
        cookieScore.push(nowScore)
        cookieScore.sort(function (a, b) {
            return b - a
        })
    } else {
        cookieScore = [nowScore]
    }

    this.showScoreList(cookieScore)
    MONKEY.Cookie.setCookie('ljds', cookieScore)
}

ScoreLayer.prototype.showScoreList = function (arr) {
    for (var i = 0; i < this.scoreListArr.length; i++) {
        if(i < arr.length) {
            this.scoreListArr[i].visible = true
            this.scoreListArr[i].getChildren('score').setText(arr[i].toString())
        } else {
            this.scoreListArr[i].visible = false
        }
    }
}
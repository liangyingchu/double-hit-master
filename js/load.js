var gameLayer

function isVulgarInternetExplorerVersion() {
    var version = navigator.appVersion.split(';')
    if(version.length > 1) {
        var trim_Version = parseInt(version[1].replace(/[ ]/g, "").replace(/MSIE/g, ""))
        return trim_Version < 9
    }
    return false
}

function onloadFunc() {
    if(isVulgarInternetExplorerVersion()) {
        document.getElementById('disableTip').style.display = 'block'
        document.getElementById('superContainer').style.display = 'none'
        return
    }

    gameLayer = new Main()

    // 加载音频资源
    var musicData = [
        { name: 'bgm', url: 'sound/bgm.mp3', loops: 1000, autoPlay: true },
        { name: 'btn', url: 'sound/btn.mp3' }
    ]
    MONKEY.Audio.createAudio(musicData)

    // 自适应
    MONKEY.Resizer.add(document.getElementById('superContainer'), true)

    // 预加载
    MONKEY.Preload.addShowType('myProgress', function (ctx, percent) {
        console.log(percent)
        document.getElementById('loadingBar').style.width = parseInt(percent) * 3 + 'px'
        document.getElementById('loadingPre').innerHTML = parseInt(percent) + '%'
        if(percent >= 100) {
            document.getElementById('loadingPage').style.display = 'none'
            document.getElementById('gamePage').style.display = 'block'
            gameLayer.init()
            gameLayer.gotoLayer('begin')
        }
    })

    var loadImgData = [
        { type: 'img', name: '', path: 'images/loading.gif' },
        { type: 'img', name: '', path: 'images/beginBg.png' },
        { type: 'img', name: '', path: 'images/gameBg.png' },
        { type: 'img', name: '', path: 'images/scoreBg.png' },
        { type: 'img', name: '', path: 'images/sth/beginMask.png' },
        { type: 'img', name: '', path: 'images/sth/gameMask.png' },
        { type: 'img', name: '', path: 'images/sth/goodTips.png' },
        { type: 'img', name: '', path: 'images/animation/beginGrid/beginGrid_1.png' },
        { type: 'img', name: '', path: 'images/animation/beginGrid/beginGrid_2.png' },
        { type: 'img', name: '', path: 'images/animation/beginGrid/beginGrid_3.png' },
        { type: 'img', name: '', path: 'images/animation/beginGrid/beginGrid_4.png' },
        { type: 'img', name: '', path: 'images/animation/beginGrid/beginGrid_5.png' },
        { type: 'img', name: '', path: 'images/animation/beginGrid/beginGrid_6.png' }
    ]

    MONKEY.Preload.loadingFile(loadImgData, 'myProgress')

}
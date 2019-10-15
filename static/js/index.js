const index = {
    $blocks: $('.box-wrap>div'),
    $sound_correct: $('#sound_correct'),
    $sound_next: $('#sound_next'),
    $good: $('#good'),
    $tip: $('#tip'),
    limitNum: 15,
    blockNum: 4,
    // const passLetters = ['A', 'B', 'C', 'E', 'K', 'L', 'M', 'O', 'Q', 'R', 'S', 'W', 'X', 'Y', 'Z'];
    okPic: {
        rdmPics: ['p_pass01_thumb.jpg', 'p_pass02_thumb.jpg', 'p_pass03_thumb_face.jpg', 'p_pass04_peiqi.jpg', 'p_pass05_peiqiAnimation.gif', 'p_pass06_qiaozhi.jpg', 'p_pass08_wolaile.gif'],
        empty: '1x1px.png',
        level1: 'p_pass09_JSON.jpg',
        level2: 'p_pass10_JSON.jpg',
        levelLast: 'p_pass07_peiqiAnimation.gif'
    },
    numbers: '0123456789',
    lowerLetters: '',
    upperLetters: '',
    operateChar: '!@#$%^&*()_+{}|:"<>?-=[];\',./`~×÷' + '，。：',
    passOperateChar: '+-×÷><=_，。：',
    // passLetters: '',
    result: '',
    counter: 1,
    resultIndex: 0,
    timer: 0,
    type: '',
    init() {
        const disruptOrder = function () {
            const isArray = Array.isArray(this);
            const arr = (isArray ? this : this.split('')).slice();
            const result = [];
            while (true) {
                if (!arr.length) break;
                const index = Math.random() * arr.length | 0;
                result.push(arr.splice(index, 1)[0]);
            }
            return isArray ? result : result.join('')
        };
        const rdm = function () {
            return this[Math.random() * this.length | 0]
        };
        Array.prototype.disruptOrder = disruptOrder;
        Array.prototype.rdm = rdm;
        String.prototype.disruptOrder = disruptOrder;
        String.prototype.rdm = rdm;
        this.lowerLetters = this.generateLetters().toLocaleLowerCase();
        this.upperLetters = this.generateLetters();
        // this.passLetters = this.upperLetters + this.lowerLetters;
        this.radioCheck();
        this.$blocksClick();

    },
    generateLetters() { // 大写字母的ASC2码是65~90
        let arr = '';
        for (let i = 65; i < 65 + 26; i++) {
            arr += String.fromCharCode(i);
        }
        return arr;
    },
    radioCheck() {
        const that = this;
        $('[name=inlineRadioOptions]').change(function () {
            that.type = $(this).val();
            if (that.type === 'operateChar') {
                that.$tip.html('目前已经学过的符号有：<br>' + that.passOperateChar.split('').join(' ') + '<br>共' + that.passOperateChar.length + '个').show();
            } else {
                that.$tip.hide()
            }
            that.shuffle();
        }).filter(':checked').change();
        $('[name=model]').change(function () {
            if($(this).val() === 'w2h2'){
                $('.box-wrap').addClass('w2h2');
                that.blockNum = 4;
            }else{
                $('.box-wrap').removeClass('w2h2');
                that.blockNum = 6;
            }
            that.shuffle();
        })
    },
    /**
     * 洗牌
     */
    shuffle() {
        let picSrc = (Math.random() < .67) ? this.okPic.empty : this.okPic.rdmPics[Math.floor(Math.random() * this.okPic.rdmPics.length)];
        switch (this.counter) {
            case 5:
                picSrc = this.okPic.level1;
                break;
            case 10:
                picSrc = this.okPic.level2;
                break;
            case this.limitNum:
                picSrc = this.okPic.levelLast;
                break;
        }
        const thumbAttr = 'static/img/' + picSrc;
        this.$good.hide().attr('src', thumbAttr);
        this.timer = null;
        this.$blocks.removeClass('correct error');
        switch (this.type) {
            case "number":
                this.result = this.numbers.rdm();
                break;
            case 'letter':
                this.result = this.upperLetters.rdm();
                break;
            case 'lowerCaseLetter':
                this.result = this.lowerLetters.rdm();
                break;
            case 'operateChar':
                this.result = this.passOperateChar.rdm();
                break;
            case 'letterOrNum':
                this.result = (this.numbers + this.upperLetters + this.lowerLetters).rdm();
        }
        this.resultIndex = Math.floor(Math.random() * this.blockNum);
        let rdmStr = [];
        // 生成随机字符串以填充方格
        while (true) {
            if (this.type === 'operateChar') {
                rdmStr = this.operateChar.split('').disruptOrder().splice(1 - this.blockNum);
            } else if (this.type === 'lowerCaseLetter') {
                rdmStr = Math.random().toString(36).substr(1 - this.blockNum).split('');
            } else if (['letter','number','letterOrNum'].includes(this.type)) {
                rdmStr = Math.random().toString(36).toUpperCase().substr(1 - this.blockNum).split('');
            }
            // 填充的字符不包含当前的答案则退出循环，即不重复
            console.log(rdmStr)
            if (!rdmStr.includes(this.result)) {
                break;
            }
        }
        //splice方法的第一个参数指对应的下标之前，如果数值很大超过了数组长度，则位置定在数组最后
        // 所以this.resultIndex在0~n的位置对应n个rdmStr字符的n+1个空隙中
        rdmStr.splice(this.resultIndex, 0, this.result + '');
        this.$blocks.each(function (index, item, self) {
            $(item).text(rdmStr[index])
        });
        $('#answer').text(this.result);
        $('#counter').text(this.counter);
    },
    $blocksClick() {
        const that = this;
        const next = () => {
            this.$blocks.css('pointer-events', 'initial');
            this.$sound_next.get(0).pause();
            this.$sound_next.get(0).play();
            if (++this.counter > this.limitNum) {
                alert('宝宝，你已经学了' + this.limitNum + '道题了，听首歌休息一下吧！');
                that.$good.addClass('w-auto');
                $("#pippaPig").slideDown(600).get(0).play();
                return;
            }
            this.shuffle();
        };
        const checkRight = () => {
            setTimeout(function () {
                that.$good.show(100)
            }, 400);

            this.$blocks.eq(this.resultIndex).addClass('correct');
            this.$sound_correct.get(0).pause();
            this.$sound_correct.get(0).play();

            this.timer = setTimeout(next, that.$good.attr("src").includes('1x1px.png') ? 1000 : 2500);
        };
        that.$blocks.click(function () {
            const text = $(this).text();
            if (!that.timer && text === that.result) {
                checkRight()
            } else {
                // $(this).addClass('error')
            }
        });

        $('body').keyup(function (e) {
            if (!that.timer && e.key === that.result) {
                checkRight()
            }
        });

    }
};
$(function () {
    index.init();
});



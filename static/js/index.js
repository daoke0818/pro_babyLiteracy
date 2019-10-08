const index = {
    $blocks: $('.box-wrap>div'),
    $sound_correct: $('#sound_correct'),
    $sound_next: $('#sound_next'),
    $good: $('#good'),
    $tip: $('#tip'),
    limitNum: 15,
    blockNum: 6,
    // const passLetters = ['A', 'B', 'C', 'E', 'K', 'L', 'M', 'O', 'Q', 'R', 'S', 'W', 'X', 'Y', 'Z'];
    okPic: {
        rdmPics: ['p_pass01_thumb.jpg', 'p_pass02_thumb.jpg', 'p_pass03_thumb_face.jpg', 'p_pass04_peiqi.jpg', 'p_pass05_peiqiAnimation.gif', 'p_pass06_qiaozhi.jpg', 'p_pass08_wolaile.gif'],
        empty: '1x1px.png',
        level1: 'p_pass09_JSON.jpg',
        level2: 'p_pass10_JSON.jpg',
        levelLast: 'p_pass07_peiqiAnimation.gif'
    },
    lowerLetters: '',
    upperLetters: '',
    passLetters: (function () {
        let arr = '';
        for (let i = 65; i < 91; i++) {
            arr += String.fromCharCode(i);
        }
        return arr;
    })(),
    result: '',
    counter: 1,
    resultIndex: 0,
    timer: 0,
    type: '',
    init() {
        this.lowerLetters = this.generateLetters('lower');
        this.upperLetters = this.generateLetters();
        this.passLetters = this.upperLetters + this.lowerLetters
        this.radioCheck();
        this.$blocksClick();

    },
    generateLetters(type) {
        let start = type === 'lower' ? 65 : 97;
        let arr = '';
        for (let i = start; i < start + 26; i++) {
            arr += String.fromCharCode(i);
        }
        return arr;
    },
    radioCheck() {
        const that = this;
        $('[name=inlineRadioOptions]').change(function () {
            that.type = $(this).val();
            /*
                        if (this.type === 'letter' || 'letterOrNum') {
                            that.$tip.html('目前已经学过的字母有：<br>' + that.passLetters.join(' ') + '<br>共' + that.passLetters.length + '个').show();
                        }
            */
            that.shuffle();
        }).filter(':checked').change();
    },
    rdm_num() {
        return Math.floor(Math.random() * 10) + '';
    },
    rdm_letter(type) {
        let result;
        const index = Math.floor(Math.random() * 26);
        while (true) {
            result = type==='lower'?this.upperLetters[index]:this.lowerLetters[index]
            if (this.passLetters.includes(result)) { break;}
        }
        return result;
    },
    /**
     * 洗牌
     */
    shuffle() {
        console.log(this.upperLetters, this.lowerLetters)
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
                this.result = this.rdm_num();
                this.$tip.hide();
                break;
            case 'letter': //大写字母的ASC2码是65~90
                this.result = this.rdm_letter();
                break;
            case 'lowerCaseLetter':
                this.result = this.rdm_letter('lower');
                break;
            case 'letterOrNum':
                this.result = Math.random() < .66 ? this.rdm_letter(Math.random() < .5?'lower':null) : this.rdm_num();
        }
        this.resultIndex = Math.floor(Math.random() * this.blockNum);
        let rdmStr = '';
        while (true) {
            rdmStr = Math.random().toString(36).toUpperCase().substr(1 - this.blockNum).split('');
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



const index = {
    $blocks: $('.box-wrap>div'),
    $sound_correct: $('#sound_correct'),
    $sound_next: $('#sound_next'),
    $good: $('#good'),
    $tip : $('#tip'),
    limitNum: 15,
    blockNum:6,
    thumbs: ['p_pass01_thumb.jpg', 'p_pass02_thumb.jpg', 'p_pass03_thumb_face.jpg', 'p_pass04_peiqi.jpg', 'p_pass05_peiqiAnimation.gif', 'p_pass06_qiaozhi.jpg'],
    // const passLetters = ['A', 'B', 'C', 'E', 'K', 'L', 'M', 'O', 'Q', 'R', 'S', 'W', 'X', 'Y', 'Z'];
    passLetters: (function () {
        let arr = [];
        for (let i = 65; i < 91; i++) {
            arr.push(String.fromCharCode(i));
        }
        return arr;
    })(),
    result: '',
    counter: 1,
    resultIndex: 0,
    timer: 0,
    type: '',
    init() {
        this.radioCheck();
        this.$blocksClick();
    },
    radioCheck() {
        const that = this;
        $('[name=inlineRadioOptions]').change(function () {
            that.type = $(this).val();
            if (this.type === 'letter' || 'letterOrNum') {
                that.$tip.html('目前已经学过的字母有：<br>' + that.passLetters.join(' ') + '<br>共' + that.passLetters.length + '个').show();
            }
            that.shuffle();
        }).filter(':checked').change();
    },
    rdm_num(){
       return  Math.floor(Math.random() * 10) + '';
    },
    rdm_letter(){
        let result;
        while (true) {
            result = String.fromCharCode(Math.floor(Math.random() * 26) + 65);
            if (this.passLetters.includes(result)) { break;}
        }
        return result;
    },
    shuffle()  {
        const thumbAttr = 'static/img/' + (this.counter === this.limitNum ? 'p_pass07_peiqiAnimation.gif' : this.thumbs[Math.floor(Math.random() * this.thumbs.length)]);
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
            case 'letterOrNum':
                this.result = Math.random() < .5 ? this.rdm_letter() : this.rdm_num();
        }
        this.resultIndex = Math.floor(Math.random() * this.blockNum);
        let rdmStr = '';
        while (true) {
            rdmStr = Math.random().toString(36).toUpperCase().substr(1-this.blockNum).split('');
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
    $blocksClick(){
        const that = this;
        const next = ()=>{
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
        const checkRight = ()=>{
            setTimeout(function () {
                that.$good.show(100)
            }, 400);

            this.$blocks.eq(this.resultIndex).addClass('correct');
            this.$sound_correct.get(0).pause();
            this.$sound_correct.get(0).play();
            this.timer = setTimeout(next, 1500);
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


/*
$(function () {
    const $blocks = $('.box-wrap>div');
    const $sound_correct = $('#sound_correct');
    const $sound_next = $('#sound_next');
    const $good = $('#good');
    const $tip = $('#tip');
    const limitNum = 20;
    const thumbs = ['p_pass01_thumb.jpg', 'p_pass02_thumb.jpg', 'p_pass03_thumb_face.jpg', 'p_pass04_peiqi.jpg', 'p_pass05_peiqiAnimation.gif', 'p_pass06_qiaozhi.jpg'];
    // const passLetters = ['A', 'B', 'C', 'E', 'K', 'L', 'M', 'O', 'Q', 'R', 'S', 'W', 'X', 'Y', 'Z'];
    const passLetters = (function () {
        let arr = [];
        for (let i = 65; i < 91; i++) {
            arr.push(String.fromCharCode(i));
        }
        return arr;
    })();

    let result = '';
    let counter = 1;
    let resultIndex = 0;
    let timer = 0;
    let type = '';

    const rdm_num = () => Math.floor(Math.random() * 10) + '';
    const rdm_letter = () => {
        let result;
        while (true) {
            result = String.fromCharCode(Math.floor(Math.random() * 26) + 65);
            if (passLetters.includes(result)) { break;}
        }
        return result;
    };
    const shuffle = () => {
        const thumbAttr = 'static/img/' + (counter === limitNum ? 'p_pass04_peiqi.jpg' : thumbs[Math.floor(Math.random() * thumbs.length)]);
        $good.hide().attr('src', thumbAttr);
        timer = null;
        $blocks.removeClass('correct error');
        switch (type) {
            case "number":
                result = rdm_num();
                $tip.hide();
                break;
            case 'letter': //大写字母的ASC2码是65~90
                result = rdm_letter();
                break;
            case 'letterOrNum':
                result = Math.random() < .5 ? rdm_letter() : rdm_num();
        }
        resultIndex = Math.floor(Math.random() * 10);
        let rdmStr = '';
        while (true) {
            rdmStr = Math.random().toString(36).toUpperCase().substr(-8).split('');
            if (!rdmStr.includes(result)) {
                break;
            }
        }
        rdmStr.splice(resultIndex, 0, result + '');
        // console.log(result,resultIndex,rdmStr);
        $blocks.each(function (index, item, self) {
            $(item).text(rdmStr[index])
        });
        $('#answer').text(result);
        $('#counter').text(counter);
    };


    function checkRight() {
        setTimeout(function () {
            $good.show(100)
        }, 400);

        $blocks.eq(resultIndex).addClass('correct');
        $sound_correct.get(0).pause();
        $sound_correct.get(0).play();
        timer = setTimeout(next, 1500);
    }

    $blocks.click(function () {
        let text = $(this).text();
        if (!timer && text === result) {
            checkRight()
        } else {
            // $(this).addClass('error')
        }

    });
    $('body').keyup(function (e) {
        if (!timer && e.key === result) {
            checkRight()
        }
    });

    let next = () => {
        $blocks.css('pointer-events', 'initial');
        $sound_next.get(0).pause();
        $sound_next.get(0).play();
        if (++counter > limitNum) {
            alert('宝宝，你已经学了' + limitNum + '道题了，听首歌休息一下吧！');
            $("#pippaPig").slideDown(600).get(0).play();
            // $('#next').text('休息了');
            // close(); // 移动端不好用，PC端有时不好用
            // $('body').css('pointer-events', 'none');
            return;
        }
        shuffle();
    }
    /!*$('#next').click(function () {

    })*!/
})*/

$(document).ready(function () {

$('.block__item--inner .block__col').on('click', function(){
    $(this).next().slideToggle(300);
     $(this).toggleClass('block__col--active');
})

$('.btn-scroll').on('click', function () {
    $('html, body').animate({
        scrollTop: 0
    }, '300');
    return false;
});

$('.mobile-wrap').on('click', function () {
    $('.line-burger').toggleClass('line-active');
    $('.wrapper__aside').toggleClass('wrapper__aside--active');
});

var windowWidth = $(window).width();
var windowHeight = $(window).height();
$(window).resize(function () {
    windowWidth = $(window).width();
    windowHeight = $(window).height();

    if (windowWidth >= 960) {
        $('.line-burger').removeClass('line-active');
        $('.wrapper__aside').removeClass('wrapper__aside--active');
    }

    CorrectSlider();
    var left = $('.team__dots-list .slick-active').position().left;
    var style = '.team__dots-list:before {left: ' + (left + 2) + 'px;}';
    $('#dot-slider').html(style);

});

$('a.main-header__link[href*="#"]').click(function () {
    let current = $('.main-header__link.main-header__link--active');
    current.removeClass('main-header__link--active');
    $(this).addClass('main-header__link--active');

    var target = $(this).attr('href');
    var pos = target.indexOf('#');
    if (pos !== -1) {
        target = target.substring(pos);
    }

    if ($(target).length > 0) {
        scrollToBlock(target);
        return false;
    }

});


$('.btn--call').on('click', function (e) {
    $('html,body').stop().animate({
        scrollTop: $('#contacts').offset().top
    }, 1000);
    e.preventDefault();
});

$('.js__accordion').on('click', function() {
    $(this).toggleClass('single__accordion--active').next().toggle(0, function() {
        stickySection();
    });
});

let elems = $('.practic__box');
elems.on('click', function (e) {
    let input = $('.practic__input');
    input.val($(e.target).text());
})

var team = $('.team__slider');
team.slick({
    speed: 500,
    infinite: true,
    adaptiveHeight: false,
    slidesToShow: 2,
    slidesToScroll: 1,
    fade: false,
    arrows: false,
    dots: true,
    appendDots: $('.team__dots'),
    dotsClass: 'team__dots-list',
    responsive: [
        {
            breakpoint: 1200,
            settings: {
                slidesToShow: 1,
                slidesToScroll: 1
            }
        },
        {
           breakpoint: 650,
            settings: {
                adaptiveHeight: true,
                slidesToShow: 1,
                slidesToScroll: 1
            } 
        }
    ]
});

let info = $(team).slick("getSlick").slideCount;
let countDesctop = 2;
let countMobile = 1;

function CorrectSlider() {
    if (windowWidth >= 1199 && info <= countDesctop) {
        $('.team__dots').css('display', 'none');
    } else {
        $('.team__dots').css('display', 'block');
        if (info == countMobile) {
            $('.team__dots').css('display', 'none');
        }

    }
}


CorrectSlider();

team.on('beforeChange', function (event, slick, currentSlide, nextSlide) {
    var left = $('.team__dots-list li:eq(' + nextSlide + ')').position().left;
    var style = '.team__dots-list:before {left: ' + (left + 2) + 'px;}';
    $('#dot-slider').html(style);
});

function validate(input, length, regExp, error, phone) {

    $(input).on('blur keyup', function () {
        var value = $(this).val();
        var that = $(this);

        regExp = regExp == '' ? /./ : regExp;

        if (phone === true) {
            bool_reg = !regExp.test(value);
        } else {
            bool_reg = regExp.test(value);
        }

        if (value.length > length && value !== '' && bool_reg) {
            that.removeClass('form-fail').addClass('form-done');
            $(error).slideUp();
        } else {
            that.removeClass('form-done').addClass('form-fail');
            $(error).slideDown();
        }
    });

}

// деакцивация кнопки если есть поле с ошибкой

function disBtn(input, btn) {
    var input = $(input);
    input.on('blur keyup', function () {

        if (input.hasClass('form-fail')) {
            $(btn).attr('disabled', 'disabled');
        } else {
            $(btn).removeAttr('disabled');
        }

    });

}

// для проверки при нажатии

function valClick(input, length, regExp, error, btn, phone) {
    var value = $(input).val();

    regExp = regExp == '' ? /./ : regExp;

    if (phone === true) {
        bool_reg = regExp.test(value);
    } else {
        bool_reg = !regExp.test(value);
    }

    if (value.length < length && value === '' && bool_reg) {
        $(input).addClass('form-fail');
        $(error).slideDown();
    }
}

//  деакцивация кнопки при нажатии

function disBtnClick(input, btn) {
    var input = $(input);

    if (input.hasClass('form-fail')) {
        $(btn).attr('disabled', 'disabled');
        return false;
    } else {
        return true;
    }

}

function validateCheck(input) {
    $(input).on('change', function () {

        var check = $(this).prop('checked');
        if (check) {
            $('button').prop('disabled', false);
        } else {
            $('button').prop('disabled', true);
        }
    });
}

$('input[type="tel"]').mask("+38 (999) 999-99-99");

var lang = window.location.href;

var regName = /^[a-zA-Zа-яА-ЯёЁ]+/;
var regEmail = /[-.\w]+@[-.\w]+\.[-.\w]+/i;
var regPhone = /[_]/i;
// пример использования

validate('#c_name', 1, regName, '.contacts__fail-name');
validate('#c_phone', 1, regPhone, '.contacts__fail-phone', true);

disBtn('#c_name, #c_phone', '.btn--send');

$('.btn--send').on('click', function () {
    var name = $('#c_name').val();
    var phone = $('#c_phone').val();
    var topic = $('#c_topic').val();
    var msg = $('#c_msg').val();

    valClick('#c_name', 1, regName, '.contacts__fail-name');
    valClick('#c_phone', 1, regPhone, '.contacts__fail-phone', true);
    var btn_bool = disBtnClick('#c_name, #c_phone', '.btn--send');
    console.log(btn_bool);
    if (btn_bool) {
        $.ajax({
            url: myajax.url,
            type: 'POST',
            data: {
                action: 'contact',
                name: name,
                phone: phone,
                topic: topic,
                msg: msg,
            },
        }).done(function (data) {
            $('#с_name, #с_phone, #c_topic, #c_msg').val('').removeClass('form-done');

            const messages = {
                'ru': 'Ваше сообщение успешно отправлено!',
                'ua': 'Ваше повідомлення успішно відправлено!',
                'en': 'Your message has been successfully sent!',
            }

            const path = window.location.pathname;

            const defaultLanguage = 'ru';

            const language = Object.keys(messages).reduce((acc, c) => path.includes(`/${c}/`) ? c : acc, defaultLanguage);

            const text = messages[language];

            $('.msg-modal').html(text).addClass('msg-modal-active');
            setTimeout(function () {
                $('.msg-modal').removeClass('msg-modal-active');
            }, 2500);
        });
    }
    return false;
});


setTimeout(function () {
    footerVisible();
    stickySection();
}, 200);

$(window).resize(function () {
    footerVisible();
    stickySection();
});


var heightContacts = $('.contacts.wrapper__box').height();

$(window).scroll(function () {
    footerVisible();
});


function footerVisible() {
    if (windowWidth > 1150 && $('.contacts.wrapper__box').length > 0) {
        var scroll = $(window).scrollTop();
        var heightSections = 0;
        $('.wrapper__box[data-elem="block"]').each(function () {
            heightSections += $(this).height();
        });

        var posVisible = heightSections - heightContacts - 200;

        if (posVisible < scroll) {
            $('.main-footer.wrapper__box').removeClass('main-footer__hidden');
        } else {
            $('.main-footer.wrapper__box').addClass('main-footer__hidden');
        }
    } else {
        $('.main-footer.wrapper__box').removeClass('main-footer__hidden');
    }
}

function stickySection() {
    if (windowWidth > 1150) {
        $('.wrapper__box[data-elem="block"]').each(function () {
            var $children = $(this).children();
            var height = $children.outerHeight();

            if (height > windowHeight || $(this).is('.contacts')) {
                var heightFooter = 0;
                var errors = 0;
                if ($(this).is('.contacts')) {
                    heightFooter = $('.main-footer').height();
                    errors = 50;
                }
                var topOffset = height - windowHeight;
                $(this).css({
                    'top': -topOffset - heightFooter - errors + 'px',
                    'height': height + errors + 'px'
                });
            }
        });
    } else {
        $('.wrapper__box[data-elem="block"]').attr('style', '')
    }
}

});
/**
 * Created by Administrator on 2017/12/7.
 */
/*!
 * jQuery Cookie Plugin v1.4.1
 * https://github.com/carhartl/jquery-cookie
 *
 * Copyright 2013 Klaus Hartl
 * Released under the MIT license
 */
(function (factory) {
    if (typeof define === 'function' && define.amd) {
        // AMD
        define(['jquery'], factory);
    } else if (typeof exports === 'object') {
        // CommonJS
        factory(require('jquery'));
    } else {
        // Browser globals
        factory(jQuery);
    }
}(function ($) {

    var pluses = /\+/g;

    function encode(s) {
        return config.raw ? s : encodeURIComponent(s);
    }

    function decode(s) {
        return config.raw ? s : decodeURIComponent(s);
    }

    function stringifyCookieValue(value) {
        return encode(config.json ? JSON.stringify(value) : String(value));
    }

    function parseCookieValue(s) {
        if (s.indexOf('"') === 0) {
            // This is a quoted cookie as according to RFC2068, unescape...
            s = s.slice(1, -1).replace(/\\"/g, '"').replace(/\\\\/g, '\\');
        }

        try {
            // Replace server-side written pluses with spaces.
            // If we can't decode the cookie, ignore it, it's unusable.
            // If we can't parse the cookie, ignore it, it's unusable.
            s = decodeURIComponent(s.replace(pluses, ' '));
            return config.json ? JSON.parse(s) : s;
        } catch (e) {
        }
    }

    function read(s, converter) {
        var value = config.raw ? s : parseCookieValue(s);
        return $.isFunction(converter) ? converter(value) : value;
    }

    var config = $.cookie = function (key, value, options) {

        // Write

        if (value !== undefined && !$.isFunction(value)) {
            options = $.extend({}, config.defaults, options);

            if (typeof options.expires === 'number') {
                var days = options.expires, t = options.expires = new Date();
                t.setTime(+t + days * 864e+5);
            }

            return (document.cookie = [
                encode(key), '=', stringifyCookieValue(value),
                options.expires ? '; expires=' + options.expires.toUTCString() : '', // use expires attribute, max-age is not supported by IE
                options.path ? '; path=' + options.path : '',
                options.domain ? '; domain=' + options.domain : '',
                options.secure ? '; secure' : ''
            ].join(''));
        }

        // Read

        var result = key ? undefined : {};

        // To prevent the for loop in the first place assign an empty array
        // in case there are no cookies at all. Also prevents odd result when
        // calling $.cookie().
        var cookies = document.cookie ? document.cookie.split('; ') : [];

        for (var i = 0, l = cookies.length; i < l; i++) {
            var parts = cookies[i].split('=');
            var name = decode(parts.shift());
            var cookie = parts.join('=');

            if (key && key === name) {
                // If second argument (value) is a function it's a converter...
                result = read(cookie, value);
                break;
            }

            // Prevent storing a cookie that we couldn't decode.
            if (!key && (cookie = read(cookie)) !== undefined) {
                result[name] = cookie;
            }
        }

        return result;
    };

    config.defaults = {};

    $.removeCookie = function (key, options) {
        if ($.cookie(key) === undefined) {
            return false;
        }
        // Must not alter options, thus extending a fresh object...
        $.cookie(key, '', $.extend({}, options, {expires: -1}));
        return !$.cookie(key);
    };
}));

/**
 * validate_rule
 * js调用
 */
var validate_rule = {
    /**
     * 有条件初始化
     */
    readyValidateIf: function (dom) {
        var me = this;
        dom.find('[validated]').off('focus').on('focus', function (event) {
            var dom = event.target;
            var validateErrorMsgDom = me.validateErrorMsgDom(dom);
            $(validateErrorMsgDom).text("");
            $('.J_error').stop();
            $('.J_error').css({opacity: 0});
            $('.J_error').text("");
        });
    },
    /**
     * 提交验证（自动验证所有需验证节点）
     * @param dom 范围需要验证的DOM节点
     */
    autoValidate: function (dom) {

        var me = this;
        var result = true;
        //验证所有需要验证的节点
        dom.find('[validated]').each(function () {
            var bool = me.goValidate(this, dom);

            if (!bool) {

                result = false;
                return result;
            }

            return result;
        });
        return result;
    },

    /**
     * 验证
     * @param dom 需验证的DOM节点
     * @returns {boolean}
     */
    goValidate: function (dom, OutDom) {

        var me = this;

        var validateRule = this.validateRule(dom); //[] 需验证规则的数组

        var validateValue = this.validateValue(dom); //string 需验证的文本

        var validateErrorMsgDom = this.validateErrorMsgDom(dom); //dom 存放错误信息的节点

        var validateErrorMsg = this.validateErrorMsg(dom); //string 错误提示信息

        var validateRange = this.validateRange(dom);

        //验证规则不存在
        if (validateRule && validateRule < 1) {
            return true;
        }

        //验证规则存在 进行验证
        for (var i = 0; i < validateRule.length; i++) {

            var result = me[validateRule[i]](validateValue, OutDom, dom); //在me中找[validateRule[i]]方法

            if (!result) {
                $(validateErrorMsgDom).text(validate_msg.replaced([validateRule[i]], validateErrorMsg)).attr('title', validate_msg.replaced([validateRule[i]], validateErrorMsg));
                $(validateErrorMsgDom).animate({left: '10px'}, 200, function () {
                    $(validateErrorMsgDom).animate({left: '-10px'}, 200, function () {
                        $(validateErrorMsgDom).animate({left: '10px'}, 200, function () {
                            $(validateErrorMsgDom).animate({left: '0'}, 200);
                        });
                    });
                });
                return false;
            } else {
                $(validateErrorMsgDom).text("");
            }
        }
        return true;
    },

    /**
     * 验证规则
     * @param dom 验证节点
     * @returns {*|Array}
     */
    validateRule: function (dom) {

        var rule = $.trim($(dom).attr('validated')).split(' ');

        //过滤验证数组中为空的数组
        $.grep(rule, function (val) {
            return ($.trim(val).length > 0);
        });

        return rule;
    },

    /**
     * 验证文本
     * @param dom 验证节点
     * @returns {*|jQuery}
     */
    validateValue: function (dom) {

        return $(dom).val();
    },

    /**
     * 验证错误提示信息位置
     * @param dom 验证节点
     * @returns {*}
     */
    validateErrorMsgDom: function (dom) {

        var errorMsg1 = $(dom).parent().find('.error');
        var errorMsg = $(dom).parent().parent().find('.error');
        var errorMsgNext = $(dom).parent().parent().parent().find('.error');
        //存在error
        if (errorMsg1.length > 0) {
            return errorMsg1[0];
        } else if (errorMsg.length > 0) {
            return errorMsg[0];
        } else if (errorMsgNext.length > 0) {
            return errorMsgNext[0];
        } else {
            //不存在error
            $(dom).parent().append('<p class="error"><p>');
            return $(dom).parent().find('.error')[0];
        }
    },

    /**
     * 错误提示信息
     * @param dom 验证节点
     * @returns {*|jQuery}
     */
    validateErrorMsg: function (dom) {

        var msg = $(dom).attr("msg");
        return msg;
    },
    validateRange: function (dom) {
        var msgRange = $(dom).attr("msgRange");
        return msgRange;
    },
    /**
     *为空验证
     * @param value 需要验证的值
     * @returns {boolean}
     */
    require: function (value) {
        return $.trim(value);
    },
    /**
     * 邮箱格式验证
     * @param value
     * @returns {boolean}
     */
    email: function (value) {
        if ($.trim(value) != '') {
            // var emailExc = /^[a-z0-9]+([._\\-]*[a-z0-9])*@([a-z0-9]+[-a-z0-9]*[a-z0-9]+[.]){1,63}[a-z0-9]+$/ ;
            var emailExc = /^\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/;
            return emailExc.test(value);
        } else {
            return true;
        }
    },

    //密码重复验证
    rePwd: function (str, dom) {
        var firstPwd = dom.find('[_pwd="firstPwd"]').val();
        // console.log(firstPwd);
        return (str == firstPwd);
    },

    //密码重复验证
    reMail: function (str, dom) {
        var firstPwd = dom.find('[_email="firstMail"]').val();
        // console.log(firstPwd);
        return (str == firstPwd);
    }
};

validate_msg = {
    'require': '请输入{name}',
    'email': '邮箱格式不正确',
    'rePwd': '密码输入不一致',
    'reMail': '邮箱输入不一致',
    replaced: function (name, msg) {
        return this[name].replace('{name}', (msg || ""));
    }
};
(function ($, window, document, undefined) {

    var SaveData = function (element, opt) {

        this.defaults = {
            data: '',
            callBack: '', //请求成功返回
            fail: true, //fail 为false 错误提示信息不显示默认的
            failBack: '', //错误提示
            noData: [],
            btn: '',
            type: 'post',
            headers: {},
            async: true,
            dataFirst: true
        };
        opt = $.extend({}, this.defaults, opt);
        this.$el = element;
        this.options = opt;
        this.init();
    };

    SaveData.prototype = {
        init: function () {
            this.initDom();
        },

        initDom: function () {
            var me = this;
            this.data = {};
            // console.log(this.$el.find('[_dcVal]'))
            //值为value
            $.each(me.$el.find('[_dcVal]'), function () {
                var _that = $(this);
                var _attr = $.trim(_that.attr('_dcVal'));
                me.data[_attr] = _that.val();
            });
            //值为text
            $.each(this.$el.find('[_dcText]'), function () {
                var _that = $(this);
                var _attr = $.trim(_that.attr('_dcText'));
                me.data[_attr] = _that.text();
            });

            //ajax需要的data
            if (me.options.data != '' && typeof me.options.data == "string") {
                me.data = me.options.data;
            } else {
                if (me.options.dataFirst) {
                    me.data = $.extend({}, me.data, me.options.data);
                } else {
                    me.data = $.extend({}, me.options.data, me.data);
                }
            }

            if (me.options.noData.length > 0) {
                $.each(me.options.noData, function (index, val) {
                    delete me.data[val];
                });
            }

            // console.log(me.data);
            me.ajaxSub(me.data);

        },

        ajaxSub: function (data) {
            var url = this.options.url ? this.options.url : this.$el.attr('_dcUrl');
            //console.log(url);
            var callBack = this.options.callBack;
            var failBack = this.options.failBack;

            //点击之后的状态文字
            var me = this;
            var opt = this.options;
            var $btnText = '';

            if ((opt.btn && !opt.btn.attr('disabled')) || !opt.btn) {
                if (opt.btn) {
                    var $btnAttr = opt.btn.attr('_dcBtn');
                    if (opt.btn.find('span').length !== 0) {
                        $btnText = opt.btn.find('span').text();
                        opt.btn.attr('disabled', 'disabled').find('span').text($btnAttr);
                    } else {
                        $btnText = opt.btn.text();
                        opt.btn.attr('disabled', 'disabled').text($btnAttr);
                    }
                }

                $.ajax({
                    url: url,
                    type: me.options.type,
                    data: data,
                    async: me.options.async,
                    headers: me.options.headers,
                    success: function (data) {
                        var response = $.parseJSON(data);
                        if (opt.btn) {
                            if (opt.btn.find('span').length !== 0) {
                                opt.btn.removeAttr('disabled').find('span').text($btnText);
                            } else {
                                opt.btn.removeAttr('disabled').text($btnText);
                            }
                        }

                        //当flag为true返回结果
                        if (response.result) {
                            if (callBack) {
                                callBack(response);
                            }
                        } else {
                            if (failBack) {
                                failBack(response);
                            }
                            if (me.options.fail) {
                                if (me.options.error) {
                                    me.options.error.attr('title', response.message).html(response.message);
                                    me.options.error.animate({left: '10px'}, 200, function () {
                                        me.options.error.animate({left: '-10px'}, 200, function () {
                                            me.options.error.animate({left: '10px'}, 200, function () {
                                                me.options.error.animate({left: '0'}, 200);
                                            });
                                        });
                                    });
                                } else if (me.$el.find('[_dcError]').length > 0) {
                                    me.$el.find('[_dcError]').attr('title', response.message).html(response.message);
                                    me.$el.find('[_dcError]').animate({left: '10px'}, 200, function () {
                                        me.$el.find('[_dcError]').animate({left: '-10px'}, 200, function () {
                                            me.$el.find('[_dcError]').animate({left: '10px'}, 200, function () {
                                                me.$el.find('[_dcError]').animate({left: '0'}, 200);
                                            });
                                        });
                                    });
                                }
                            }
                        }
                    },
                    error: function () {
                        if (opt.btn) {
                            if (opt.btn.find('span').length !== 0) {
                                opt.btn.removeAttr('disabled').find('span').text($btnText);
                            } else {
                                opt.btn.removeAttr('disabled').text($btnText);
                            }
                        }
                        var msg = '服务器开了个小差！';
                        if (me.options.error) {
                            me.options.error.attr('title', msg).html(msg);
                            me.options.error.animate({left: '10px'}, 200, function () {
                                me.options.error.animate({left: '-10px'}, 200, function () {
                                    me.options.error.animate({left: '10px'}, 200, function () {
                                        me.options.error.animate({left: '0'}, 200);
                                    });
                                });
                            });
                        } else if (me.$el.find('[_dcError]').length > 0) {
                            me.$el.find('[_dcError]').attr('title', msg).html(msg);
                            me.$el.find('[_dcError]').animate({left: '10px'}, 200, function () {
                                me.$el.find('[_dcError]').animate({left: '-10px'}, 200, function () {
                                    me.$el.find('[_dcError]').animate({left: '10px'}, 200, function () {
                                        me.$el.find('[_dcError]').animate({left: '0'}, 200);
                                    });
                                });
                            });
                        }
                    }
                });
            }
        }
    };

    $.fn.dcAjax_post = function (options) {
        return this.each(function () {
            var $this = $(this);
            options.type = 'post';
            new SaveData($this, options);
        });
    };
    $.fn.dcAjax_get = function (options) {
        return this.each(function () {
            var $this = $(this);
            options.type = 'get';
            new SaveData($this, options);
        });
    };

})(jQuery, window, document);

//邮箱地址
var hash = {
    'qq.com': 'http://mail.qq.com',
    'gmail.com': 'http://mail.google.com',
    'sina.com': 'http://mail.sina.com.cn',
    '163.com': 'http://mail.163.com',
    '126.com': 'http://mail.126.com',
    'yeah.net': 'http://www.yeah.net/',
    'sohu.com': 'http://mail.sohu.com/',
    'tom.com': 'http://mail.tom.com/',
    'sogou.com': 'http://mail.sogou.com/',
    '139.com': 'http://mail.10086.cn/',
    'hotmail.com': 'http://www.hotmail.com',
    'live.com': 'http://login.live.com/',
    'live.cn': 'http://login.live.cn/',
    'live.com.cn': 'http://login.live.com.cn',
    '189.com': 'http://webmail16.189.cn/webmail/',
    'yahoo.com.cn': 'http://mail.cn.yahoo.com/',
    'yahoo.cn': 'http://mail.cn.yahoo.com/',
    'eyou.com': 'http://www.eyou.com/',
    '21cn.com': 'http://mail.21cn.com/',
    '188.com': 'http://www.188.com/',
    'foxmail.coom': 'http://www.foxmail.com'
};

// var address = ''; //服务器地址，如果不需要写死，打开下面注释，此行注释或删掉
var address = '';

var wan_login = {
    ready: function () {
        this.initClick();
        validate_rule.readyValidateIf($('.J_loginForm'));
        validate_rule.readyValidateIf($('.J_findBox'));
        $('[_dcVal="user_name"]').val($.cookie("_wanU"));
        if ($.cookie("_wanU")) {
            $('.J_forgetId').find('i').addClass('active')
        }
    },
    initClick: function () {
        var me = this;
        $('.J_close').off('click').on('click', function () {
            $('.J_findBox').find('.error').text('');
            $('.J_loginBox').removeClass('display-none');
            $('.J_findBox').addClass('display-none');
        });
        $('.J_close2').off('click').on('click', function () {
            $('.J_alertOut').hide();
        });
        $('.J_findPwd').off('click').on('click', function () {
            $('.J_loginBox').find('.error').text('');
            $('.J_loginBox').addClass('display-none');
            $('.J_findBox').removeClass('display-none');

        });
        $('.J_clearInput').off('click').on('click', function () {
            $(this).parent().find('input').val('');
        });

        $('.J_forgetId').off('click').on('click', function () {
            if ($(this).find('i').hasClass('active')) {
                $(this).find('i').removeClass('active');
            } else {
                $(this).find('i').addClass('active');
            }
        });
        //login
        $('.J_goLogin').off('click').on('click', function () {
            me.pushData($(this));
        });
        //findPwd
        $('.J_sendEmail').off('click').on('click', function () {
            me.pushDataEmail($(this));
        });
    },
    pushData: function (_that) {
        if (validate_rule.autoValidate($('.J_loginForm'))) {
            $('.J_loginForm').dcAjax_post({
                url: address + '/login',
                btn: _that,
                callBack: function (response) {
                    if ($('.J_forgetId').find('i').hasClass('active')) {
                        $.cookie("_wanU", $('[_dcVal="user_name"]').val(), {path: '/', expires: 7});
                    } else {
                        $.cookie("_wanU", null);
                    }
                    //登录成功
                    window.location.href = address + '/index';
                }
            });
        }
    },
    pushDataEmail: function (_that) {
        if (validate_rule.autoValidate($('.J_findBox'))) {
            $('.J_findBox').dcAjax_post({
                url: address + '/send_email',
                btn: _that,
                callBack: function (response) {
                    $('.J_alertOut').show();
                    var email = $('[_dcVal="to_email"]').val();//邮箱地址
                    email = email.split("@")[1];
                    for (var j in hash) {
                        $('.J_goEmail').attr("href", hash[email]);
                    }
                    //邮件发送成功
                }
            });
        }
    }
};

var wan_index = {
    ready: function () {
        this.initClick();
        this.initDom();
        validate_rule.readyValidateIf($('.J_detailBox'));
        validate_rule.readyValidateIf($('.J_alertOut2'));
        validate_rule.readyValidateIf($('.J_alertOut1'));
    },
    initDom: function () {
        $('.J_account').dcAjax_get({
            url: address + '/accountMsg',
            callBack: function (response) {
                $('.J_account').find('p').eq(0).find('span').text(response.data.livetime);
                $('.J_account').find('p').eq(2).find('span').text(response.data.permissions.join(','));
                $('.J_account').find('p').eq(1).find('span').text(response.data.times.join(','));
            }
        })
    },
    initClick: function () {
        var me = this;
        $('.J_navChange').off('click').on('click', function () {
            $("[_show]").addClass('display-none');
            $("[_show=" + $(this).attr('_showDetail') + "]").removeClass('display-none');
            $('.J_navChange').removeClass('active');
            $(this).addClass('active');
        });
        $('.J_bindEmail').off('click').on('click', function () {
            me.showTip(2);
        });
        $('.J_changePwd').off('click').on('click', function () {
            me.showTip(1);
        });
        $('.J_close').off('click').on('click', function () {
            $('.J_alertAll').hide();
            $('.J_alertOut').hide();
        });
        //解析
        $('.J_goDetail').off('click').on('click', function () {
            me.pushDataDetail($(this));
        });
        //绑定邮箱
        $('.J_bindEmailGo').off('click').on('click', function () {
            me.pushDataEmail($(this));
        });
        //确认修改密码
        $('.J_surePwd').off('click').on('click', function () {
            me.pushDataPwd($(this));
        });
        //退出账号
        $('.J_goOut').off('click').on('click', function () {
            me.goOut();
        });

        $('.J_clear').off('click').on('click', function () {
            $('.J_alertOut1').find('input').val('');
        });
    },
    pushDataDetail: function (_that) {
        var me = this;
        if (validate_rule.autoValidate($('.J_detailBox'))) {
            $('.J_downBtn').addClass('visibility');
            $('.J_detailBox').dcAjax_post({
                url: address + '/parse',
                btn: _that,
                callBack: function (response) {
                    var _url = '';
                    var _url2 = '';
                    var _text1 = '';
                    var _text2 = '';
                    if (response.type == 0) {
                        if (response.urlList.length > 1) {
                            _text1 = 'VIP电信下载';
                            _text2 = '移动/网通下载';
                            _url = response.urlList[0];
                            _url2 = response.urlList[1];
                        } else {
                            _text1 = 'vip电信下载';
                            _url = response.urlList[0];
                        }
                    } else if (response.type == 1) {
                        if (response.urlList.length > 1) {
                            _text1 = response.urlList[0];
                            _text2 = response.urlList[1];
                            _url = '/elePNG';
                            _url2 = '/elePSD';
                        } else {
                            _text1 = response.urlList[0];
                            _url = '/elePNG';
                        }
                    } else if (response.type == 2) {
                        if (response.urlList.length > 1) {
                            _text1 = response.urlList[0];
                            _text2 = response.urlList[1];
                             _url = '/mbjpg';
                            _url2 = '/mbpsd';

                        } else {
                            _text1 = response.urlList[0];
                            _url = '/mbpsd';
                        }
                    } else if (response.type == 3) {
                        if (response.urlList.length > 1) {
                            _text1 = response.urlList[0];
                            _text2 = response.urlList[1];
                            _url = '/bgPNG';
                            _url2 = '/bgPSD';
                        } else {
                            _text1 = response.urlList[0];
                            _url = '/bgPNG';
                        }
                    } else if (response.type == 4) {
                        _text1 = response.urlList[0];
                        _url = '/peitu';
                    } else if (response.type == 5) {
                        _text1 = response.urlList[0];
                        _url = '/office';
                    } else if (response.type == 6) {
                        _text1 = "立即下载";
                        _url = '/video';
                    } else if (response.type == 7) {
                        if (response.urlList.length > 1) {
                            _text1 = response.urlList[0];
                            _text2 = response.urlList[1];
                            _url = '/wordart';
                            _url2 = '/bgPSD';
                        } else {
                            _text1 = response.urlList[0];
                            _url = '/wordart';
                        }
                    } else if (response.type == 8) {
                        _text1 = "立即下载";
                        _url = '/audio';
                    }else if (response.type == 13) {
                        if (response.urlList.length > 1) {
                            _text1 = '下载原图';
                            _text2 = '下载源文件';
                            _url = response.urlList[0];
                            _url2 = response.urlList[1];
                        } else {
                            _text1 = '下载原图';
                            _url = response.urlList[0];
                        }
                    } else if (response.type == 14) {
                        if (response.urlList.length > 1) {
                            _text1 = '下载原图';
                            _text2 = '下载源文件';
                            _url = "/IllusDown";
                            _url2 = "/_IllusPSD";
                        } else {
                            _text1 = '下载原图';
                            _url = "/IllusDown";
                        }
                    } else if (response.type == 11) {
                        _text1 = '下载原图';
                        _url = response.urlList[0];
                    } else if (response.type == 12) {
                        _text1 = '下载源文件';
                        _url = response.urlList[0];
                    }

                    $('.J_down1').text(_text1).attr({'_url': _url, '_pId': response.picID, '_type': response.type});
                    if (_text2) {
                        $('.J_btn2').show();
                        $('.J_down2').text(_text2).attr({
                            '_url': _url2,
                            '_pId': response.picID,
                            '_type': response.type
                        });
                    } else {
                        $('.J_btn2').hide();
                    }
                    $('.J_downBtn').removeClass('visibility');
                    me.btnDown();

                },
                fail: false,
                failBack: function (response) {
                    me.showTip(5, response.message);
                    window.setTimeout(function () {
                        $('.J_alertAll').hide();
                        $('.J_alertOut').hide();
                    }, 3000);
                }
            });
        }
    },
    btnDown: function () {
        var me = this;
        $('.J_down1').off('click').on('click', function () {
            var _url = $(this).attr('_url');
            var _pId = $(this).attr('_pId');
            var _type = $(this).attr('_type');
            if (_type == 0 || _type == 11 || _type == 12 || _type == 13) {
                window.location.href = _url;
            } else {
                $('.J_down1').dcAjax_post({
                    url: address + _url,
                    btn: $(this),
                    data: {
                        id: _pId
                    },
                    callBack: function (response) {
                        window.location.href = response.url;
                    },
                    fail: false,
                    failBack: function (response) {
                        me.showTip(5, response.message);
                        window.setTimeout(function () {
                            $('.J_alertAll').hide();
                            $('.J_alertOut').hide();
                        }, 3000);
                    }

                });
            }
        });
        $('.J_down2').off('click').on('click', function () {
            var _url = $(this).attr('_url');
            var _pId = $(this).attr('_pId');
            var _type = $(this).attr('_type');
            if (_type == 0 || _type == 11 || _type == 12 || _type == 13) {
                window.location.href = _url;
            } else {
                $('.J_down2').dcAjax_post({
                    url: address + _url,
                    btn: $(this),
                    data: {
                        id: _pId
                    },
                    callBack: function (response) {
                        window.location.href = response.url;
                    },
                    fail: false,
                    failBack: function (response) {
                        me.showTip(5, response.message);
                        window.setTimeout(function () {
                            $('.J_alertAll').hide();
                            $('.J_alertOut').hide();
                        }, 3000);
                    }
                })
            }
        });
    },
    pushDataEmail: function (_that) {
        var me = this;
        if (validate_rule.autoValidate($('.J_alertOut2'))) {
            $('.J_alertOut2').dcAjax_post({
                url: address + '/bding_email',
                btn: _that,
                callBack: function (response) {
                    $('.J_alertOut3').find('span').text($('.J_alertOut2').find('[_dcVal="email"]').val());
                    me.showTip(3);
                    window.setTimeout(function () {
                        $('.J_alertAll').hide();
                        $('.J_alertOut').hide();
                    }, 1500);
                }
            });
        }
    },
    pushDataPwd: function (_that) {
        var me = this;
        if (validate_rule.autoValidate($('.J_alertOut1'))) {
            $('.J_alertOut1').dcAjax_post({
                url: address + '/modifyPwd',
                btn: _that,
                callBack: function (response) {
                    me.showTip(4);
                    window.setTimeout(function () {
                        $('.J_alertAll').hide();
                        $('.J_alertOut').hide();
                        me.goOut();
                        location.reload()
                    }, 1500);
                }
            });
        }
    },
    goOut: function () {
        $('.J_surePwd').dcAjax_get({
            url: address + '/logouts'
        });
    },
    showTip: function (num, txt) {
        $('.J_alertOut').find('.error').text('');
        $('.J_alertAll').hide();
        $('.J_inAlert').removeClass('in-alert-small');
        if (num == 1) {
            $('.J_alertOut1').show();
        } else if (num == 2) {
            $('.J_alertOut2').show();
        } else if (num == 3) {
            $('.J_alertOut3').show();
            $('.J_inAlert').addClass('in-alert-small');
        } else if (num == 4) {
            $('.J_alertOut4').show();
            $('.J_inAlert').addClass('in-alert-small');
        } else {
            $('.J_alertOut5').show();
            $('.J_tipMsg').text(txt);
            $('.J_inAlert').addClass('in-alert-small');
        }
        $('.J_alertOut').show();
    }
};
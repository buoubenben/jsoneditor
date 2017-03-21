/**
 * Created by Administrator on 2017/3/17.
 * 创建颜色拾取器编辑器
 */
JSONEditor.defaults.editors.jpicker = JSONEditor.AbstractEditor.extend({
    register: function () {
        this._super();
    },
    typecast: function (value) {
        if (this.schema.type === "boolean") {
            return !!value;
        }
        else if (this.schema.type === "number") {
            return 1 * value;
        }
        else if (this.schema.type === "integer") {
            return Math.floor(value * 1);
        }
        else {
            return "" + value;
        }
    },
    setValue: function (value) {
        this.value = value;
        this.change();

    },
    getValue: function () {
        return this.value;
    },
    build: function () {
        var self = this;
        if (!this.options.compact) this.header = this.label = this.theme.getFormInputLabel(this.getTitle());
        if (this.schema.description) this.description = this.theme.getFormInputDescription(this.schema.description);

        this.format = this.schema.format;

        //界面绘制
        this.draw();

        if (this.options.compact) this.container.className += ' compact';
        this.control = this.theme.getFormControl1(this.label, this.draw(), this.description, this);
        this.container.appendChild(this.control);

        this.setupJpicker(this.label);


        //监听并赋值


        this.checkListener();


    },
    draw: function () {
        var colorContainer;
        colorContainer = document.createElement('div');
        colorContainer.className = 'jpicker';
        return colorContainer;

    },
    setupJpicker: function (label) {
        var self = this;
        var fn = function (color, context) {
            var all = color.val('all');
            self.value = all.hex;

            //点击checkbox 获取ok按钮 调用监听函数
            var okbtn = document.getElementsByClassName('Ok');
            for (var i = 0; i < okbtn.length; i++) {
                self.watchok(okbtn, i);
            }
        };


        var options = $extend({}, JSONEditor.plugins.jpicker);
        if (this.schema.options && this.schema.options.custom_option) options = $extend(options, this.schema.options.custom_option);
        window.jQuery.fn.jPicker.defaults.images.clientPath = '../images/';
        this.colorPicker = window.jQuery('.jpicker').jPicker(options, fn);
        this.initstatus(label);

    },
    initstatus: function (label) {
        if (this.schema.disable) {
            window.jQuery(this.checkboxradio).checkboxradio("disable");
            label.style.color = '#c5c5c5';
        } else {
            document.getElementById(this.schema.options.custom_option.mid).checked = true;
        }
    },
    watchok: function () {//监听OK按钮点击事件
        var self = this;
        var button = document.getElementsByClassName('Button')[0];
        console.log(button);
        button.addEventListener('click', function (e) {
            e.preventDefault();
            e.stopPropagation();
            self.is_dirty = true;

            self.refreshValue();
            self.onChange(true);
        });

    },
    checkListener: function () {
        var self = this;
        var checkboxes = document.getElementById(this.schema.options.custom_option.mid);
        checkboxes.addEventListener('change', function (e) {
            e.preventDefault();
            e.stopPropagation();
            if (this.checked) {
                self.enable();
            } else {
                self.disable();
            }

        });

    },
    enable: function () {
        this.label.style.color = '';
        this.value=window.jQuery.jPicker.List[0].color.active.val('hex');

        //去掉遮罩层
        var spanjp=this.label.nextSibling.nextSibling;
        var spanjp_div=spanjp.getElementsByTagName('div')[0];
        spanjp.removeChild(spanjp_div);

        this.refreshValue();
        this.onChange(true);
        this._super();
    },
    disable: function () {
        this.label.style.color = '#c5c5c5';
        this.value = null;

        //添加遮罩层
        var spanjp=this.label.nextSibling.nextSibling;
        var spanjp_div=document.createElement('div');
        spanjp.appendChild(spanjp_div);
        spanjp_div.style.backgroundColor='#eee';
        spanjp_div.style.width='25px';
        spanjp_div.style.height='24px';
        spanjp_div.style.position='relative';
        spanjp_div.style.zIndex=9;
        spanjp_div.previousElementSibling.style.position='absolute';
        spanjp_div.parentElement.style.position='absolute';
        spanjp_div.style.border='1px solid #ccc';
        spanjp_div.style.borderRadius='50%';
        spanjp_div.style.cursor='not-allowed';

        this.is_dirty = true;

        this.refreshValue();
        this.onChange(true);
        this._super();
    }

});

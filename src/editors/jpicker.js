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
        var uuid = this.theme.GenNonDuplicateID();
        this.input = this.draw(uuid);

        if (this.options.compact) this.container.className += ' compact';
        this.control = this.theme.getFormControlB3(this.label, this.input, this.description, this);
        this.container.appendChild(this.control);


        this.setupJpicker(this.label, uuid);

        //监听并赋值
        this.checkListener();

    },
    draw: function (uuid) {
        var colorContainer;
        colorContainer = document.createElement('input');
        colorContainer.value = this.schema.default;
        colorContainer.id = uuid;
        colorContainer.style.display='none';
        colorContainer.className = 'jpicker';
        return colorContainer;

    },
    setupJpicker: function (label, uuid) {
        var self = this;
        //回调函数给颜色赋值
        var fn = function (color, context) {
            var all = color.val('all');
            self.value = '#'+all.ahex;

            self.refreshValue();
            self.onChange(true);

        };
        var jpConfig = this.schema.options.custom_option;

        var options = $extend({}, JSONEditor.plugins.jpicker);
        if (this.schema.options && this.schema.options.custom_option) options = $extend(options, jpConfig);
        window.jQuery.fn.jPicker.defaults.images.clientPath = '../images/';
        this.colorPicker = window.jQuery('#' + uuid).jPicker(options, fn);
        this.initstatus(label);


    },
    initstatus: function (label) {
        if (this.schema.disable) {
            // window.jQuery(this.checkboxradio).checkboxradio("disable");
            label.style.color = '#c5c5c5';
        } else {
            if (this.control.firstElementChild.type == 'checkbox') {
                this.control.firstElementChild.checked = true;
            }
        }
    },
    checkListener: function () {
        var self = this;
        var checkboxes = self.control.firstElementChild;
        if (checkboxes.type == 'checkbox') {
            checkboxes.addEventListener('change', function (e) {
                e.preventDefault();
                e.stopPropagation();
                if (this.checked) {
                    self.enable();
                } else {
                    self.disable();
                }

            });
        }

    },
    enable: function () {
        this.label.style.color = '';
        // this.value=window.jQuery.jPicker.List[0].color.active.val('hex');
        this.value = this.input.value;
        //去掉遮罩层
        var spanjp = this.label.nextSibling.nextSibling.firstChild;
        var spanjp_div = spanjp.getElementsByTagName('div')[0];
        spanjp.removeChild(spanjp_div);

        this.refreshValue();
        this.onChange(true);
        this._super();
    },
    disable: function () {
        this.label.style.color = '#c5c5c5';

        this.input.value = this.value;
        this.value = null;

        //添加遮罩层
        var spanjp = this.label.nextSibling.nextSibling.firstChild;
        var spanjp_div = document.createElement('div');
        spanjp.appendChild(spanjp_div);
        spanjp_div.style.backgroundColor = '#eee';
        spanjp_div.style.width = '25px';
        spanjp_div.style.height = '24px';
        spanjp_div.style.position = 'relative';
        spanjp_div.style.top = '-20px';
        spanjp_div.style.zIndex = 10;
        // spanjp_div.previousElementSibling.style.position='absolute';
        // spanjp_div.parentElement.style.position='absolute';
        spanjp_div.style.border = '1px solid #ccc';
        spanjp_div.style.borderRadius = '50%';
        spanjp_div.style.cursor = 'not-allowed';

        this.is_dirty = true;

        // this.refreshValue();
        this.onChange(true);
        this._super();
    }

});

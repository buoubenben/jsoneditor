/**
 * Created by Administrator on 2017/3/9.
 * 第四步：创建扩展editor
 */
JSONEditor.defaults.editors.checkboxradio = JSONEditor.AbstractEditor.extend({
    register: function () {
        this._super();
        if (!this.input) return;
        this.input.setAttribute('name', this.formname);
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
        value = this.typecast(value || '');
        var sanitized = value;

        // if (this.enum_values.indexOf(sanitized) < 0) {
        //     sanitized = this.enum_values[0];
        // }

        var enum_val = this.enum_options[this.enum_values.indexOf(sanitized)];

        $each(this.checkboxradio, function (key, obj) {
            if (obj.value == enum_val) {
                window.jQuery(obj).attr('checked', 'checked');
                window.jQuery(obj).prev().addClass(" ui-checkboxradio-checked ui-state-active");
            }
        });


        this.value = sanitized;

        this.change();
    },
    getValue: function () {
        return this.value;
    },
    preBuild: function () {
        var self = this;
        this.input_type = 'select';
        this.enum_options = [];
        this.enum_values = [];
        this.enum_display = [];
        var i;

        // Enum options enumerated
        if (this.schema.options.custom_option["enum"]) {
            var display = this.schema.options && this.schema.options.custom_option && this.schema.options.custom_option.enum_titles || [];

            $each(this.schema.options.custom_option["enum"], function (i, option) {
                self.enum_options[i] = "" + option;
                self.enum_display[i] = "" + (display[i] || option);
                self.enum_values[i] = self.typecast(option);
            });
        }
    },
    build: function () {
        var self = this;
        if (!this.options.compact) this.header = this.label = this.theme.getFormInputLabel(this.getTitle());
        if (this.schema.description) this.description = this.theme.getFormInputDescription(this.schema.description);

        this.format = this.schema.format;

        //界面绘制
        this.input = this.draw();

        //监听并赋值
        this.input.addEventListener('change', function (e) {
            e.preventDefault();
            e.stopPropagation();
            self.value = e.srcElement.value;

            self.is_dirty = true;

            self.refreshValue();
            self.onChange(true);
        });


        if (this.options.compact) this.container.className += ' compact';
        this.control = this.theme.getFormControlB3(this.label, this.input, this.description, this);
        this.container.appendChild(this.control);

        this.setupCheckboxRadio(this.label);

        this.checkListener();

        //监checkboxes


    },
    draw: function () {//绘制界面
        var checkboxradioContainer, checkboxradioLabel, checkboxradioInput;
        checkboxradioContainer = document.createElement('div');
        checkboxradioContainer.className += " widget";
        var unid=this.theme.GenNonDuplicateID();
        var option = this.schema.options.custom_option;
        for (var i = 0; i < option.enum_title.length; i++) {
            var uuid=this.theme.GenNonDuplicateID();
            checkboxradioLabel = document.createElement('label');
            checkboxradioLabel.setAttribute('for', 'radio' + uuid);
            checkboxradioLabel.innerHTML = option.enum_title[i];

            checkboxradioInput = document.createElement('input');
            checkboxradioInput.setAttribute('type', 'radio');
            checkboxradioInput.name = 'radio'+unid;
            checkboxradioInput.id = 'radio' + uuid;
            checkboxradioInput.value = option.enum[i];
            checkboxradioContainer.appendChild(checkboxradioLabel);
            checkboxradioContainer.appendChild(checkboxradioInput);
        }
        return checkboxradioContainer;
    },
    setupCheckboxRadio: function (label) {
        var options = $extend({}, JSONEditor.plugins.checkboxradio);
        if (this.schema.options && this.schema.options.custom_option) options = $extend(options, this.schema.options.custom_option);
        this.checkboxradio = window.jQuery('.widget input').checkboxradio(options);
        this.initstatus(label);

    },
    initstatus:function (label) {
        if(this.schema.disable) {
            window.jQuery(this.input).children('input').checkboxradio("disable");
            label.style.color='#c5c5c5';
        }else {
            if(this.control.firstElementChild.type=='checkbox'){
                this.control.firstElementChild.checked=true;
            }
        }

    },
    checkListener: function () {//创建监听checkbox
        var self = this;
        var checkboxes = self.control.firstElementChild;
        if(checkboxes.type=='checkbox'){
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
        window.jQuery(this.input).children('input').checkboxradio("enable");
        this.label.style.color = '';
        this.value=this.input.value;
        this.refreshValue();
        this.onChange(true);
        this._super();
    },
    disable: function () {
        window.jQuery(this.input).children('input').checkboxradio("disable");
        this.label.style.color = '#c5c5c5';
        this.input.value=this.value;
        this.value = null;

        this.is_dirty = true;

        this.onChange(true);
        this._super();
    }
});

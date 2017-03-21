/**
 * Created by Administrator on 2017/3/3.
 */
JSONEditor.defaults.editors.colorpicker = JSONEditor.AbstractEditor.extend({
    register: function() {
        this._super();
        this.colorpickerHex=document.getElementsByClassName('colorpicker_hex');
        for(var i=0;i<this.colorpickerHex.length;i++){
            for(var j=0;j<this.colorpickerHex[i].getElementsByTagName('input').length;j++){
                this.colorpickerHex[i].getElementsByTagName('input')[j].setAttribute('name',this.formname);
            }

        }


    },
    setValue: function (value) {
        this.value=value;
        this.change();
    },
    getValue:function () {
        return this.value;
    },

    build: function () {
        var self = this;
        if (!this.options.compact) this.header = this.label = this.theme.getFormInputLabel(this.getTitle());
        if (this.schema.description) this.description = this.theme.getFormInputDescription(this.schema.description);


        this.format = this.schema.format;

        var mid=this.schema.options.colorpicker_option.mid;

        //界面绘制
        this.draw();

        if (this.options.compact) this.container.className += ' compact';
        this.control = this.theme.getFormControl(this.label, this.draw(), this.description);
        this.container.appendChild(this.control);

        this.setupColorPicker(mid);

        var btn=document.getElementsByClassName('colorpicker_submit');
        function colorpickerSubmit(i) {
            btn[i].addEventListener('click',function (e) {
                e.preventDefault();
                e.stopPropagation();
                self.is_dirty = true;

                self.refreshValue();
                self.onChange(true);
            });
        }
        for(var i=0;i<btn.length;i++){
            colorpickerSubmit(i);
        }
    },
    draw:function () {
        var colorContainer, colorSelect, colorpickerHolder;
        var mid=this.schema.options.colorpicker_option.mid;
        colorContainer = document.createElement('div');
        colorSelect = document.createElement('div');
        colorpickerHolder = document.createElement('div');

        colorContainer.className = 'color-container row';
        colorSelect.className = 'col-md-2';
        colorpickerHolder.className = 'col-md-2';

        if(mid) {
            colorSelect.id = 'colorSelector' + '_' + mid;
            colorpickerHolder.id = 'colorpickerHolder' + '_' + mid;
        }else {
            colorSelect.id = 'colorSelector' + '_' + 256;
            colorpickerHolder.id = 'colorpickerHolder' + '_' + 256;
        }


        colorContainer.appendChild(colorSelect);
        colorContainer.appendChild(colorpickerHolder);

        return colorContainer;
    },
    setupColorPicker: function (mid) {
        var self=this;
        this.value='ff0000';
        var fn={
            onSubmit: function(hsb, hex, rgb, el) {
                self.value=hex;
            }
        };
        var options = $extend({}, JSONEditor.plugins.colorpicker,fn);
        if (this.schema.options && this.schema.options.colorpicker_option) options = $extend(options, this.schema.options.colorpicker_option);
        if(mid){
            this.colorPicker = window.jQuery('#colorpickerHolder'+'_'+mid).ColorPicker(options);
        }else {
            this.colorPicker = window.jQuery('#colorpickerHolder'+'_'+256).ColorPicker(options);
        }

    }

});
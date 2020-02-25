define([], function () {
    var Me = {
        App: function (appId) {
            this.AppID = appId;
            this.RegisterTemplates = function (templates) {
                //TODO: put templates and util modules into app module
                General.Templates.Register(General.Util, {
                    id: 'DynamicEditor', //a.k.a "App"...is it needed at this level?
                    templates: templates
                });

            };
            this.Template = function (templateId) {

                this.TemplateID = templateId;
                this.Selector = $("#" + this.AppID + "_" + this.TemplateID);

                this.Drop = function () {
                    //Get template html and drop to dom and reload selector
                    $(document.forms[0]).append('<div id="' + this.AppID + '_' + this.TemplateID + '" style="display:none;">' + $('#' + this.TemplateID).html() + '</div>'); //Put template on dom first
                    this.Selector = $("#" + this.AppID + "_" + this.TemplateID);

                };
                this.Show = function (speed) {

                    //Re-check since variable doesn't change when removed from dom
                    this.Selector = $("#" + this.AppID + "_" + this.TemplateID);

                    if (this.Selector.length === 0)
                        this.Drop();

                    this.Selector.show(speed);

                    return this;
                };
                this.Hide = function (speed) {

                    if (this.Selector.length === 0)
                        this.Drop();

                    this.Selector.hide(speed);

                    return this;
                };
                this.Remove = function () {

                    if (this.Selector.length === 1)
                        this.Selector.detach();

                    return this;
                };
                this.Move = function (top, left) {
                    if (this.Selector.length === 0)
                        this.Drop();

                    this.Selector.css("left", left).css("top", top);

                    return this;
                };
                this.Width = function (width) {
                    if (this.Selector.length === 0)
                        this.Drop();

                    this.Selector.width(width);
                    return this;
                };
                this.Height = function (height) {
                    if (this.Selector.length === 0)
                        this.Drop();

                    this.Selector.height(height);
                    return this;
                };
                this.Css = function (name, value) {
                    if (this.Selector.length === 0)
                        this.Drop();

                    this.Selector.css(name, value);
                    return this;
                };
                this.Animate = function (animation) {
                    if (this.Selector.length === 0)
                        this.Drop();

                    this.Selector.animate(animation);
                    return this;
                };
                this.Bind = function (data, key) {
                    if (this.Selector.length === 0)
                        this.Drop();

                    General.Binder.DataBind(data, key);
                    return this;
                };
                this.BindTable = function (settings) { //data, key, tableid, rowtemplateid, rowbinding, rowbound, tablebound) {

                    if (this.Selector.length === 0)
                        this.Drop();

                    var table = General.Binder.DataBindTable(settings);
                    //{
                    //    databindkey : settings.databindkey,
                    //    data: settings.data,
                    //    rowtemplateid: settings.rowtemplateid,
                    //    tableid: settings.tableid,
                    //    rowbinding: settings.rowbinding,
                    //    rowbound: settings.rowbound,
                    //    tablebound: settings.tablebound
                    //})
                    return this;
                };
                this.HTML = function (paramArray) {
                    if (this.Selector.length === 0)
                        this.Drop();

                    var currentHtml = $("#" + this.TemplateID).html();
                    var newHtml = currentHtml.SearchAndReplace.apply(currentHtml, paramArray);

                    this.Selector.html(newHtml);
                    return this;
                };
                this.Click = function (sender, args) {

                    return this;
                }; //Accepts events from template

                return this;

            };

            this.Clicked = null;
            this.Click = null;
            this.BindChanged = null;
            this.Refresh = null;

            return this;
        },

    }
    return Me;
})
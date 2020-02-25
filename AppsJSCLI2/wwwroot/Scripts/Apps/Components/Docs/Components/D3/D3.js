define([], function () {
    var Me = {
        Enabled: true,
        Color: 'blue',
        Name: 'D3',
        Doc: null,
        DocType: null,  
        Data: null,
        Initialize: function () {

            Apps.Debug.Trace(this);

        },
        Show: function (items) {

            Apps.LoadScript2('https://d3js.org/d3.v3.min.js', function () {

                //transform doc heirarchy to d3
                Apps.RegisterDataSingle({ name: 'D3_DocTypes', path: Apps.Settings.WebRoot + '/api/Docs/GetDocTypes' }, function () {

                    //formats (doc types)
                    let formats = [];

                    let docTypeIds = [];

                    $.each(items, function (i, item) {

                        if (docTypeIds.indexOf(item.parentDocTypeID) === -1)
                            docTypeIds.push(item.parentDocTypeID);

                        if (docTypeIds.indexOf(item.childDocTypeID) === -1)
                            docTypeIds.push(item.childDocTypeID);

                    });

                    $.each(docTypeIds, function (i, docTypeId) {

                        let docType = Enumerable.From(Apps.Data.D3_DocTypes.data).Where('$.docTypeID === ' + docTypeId).ToArray();
                        if (docType.length === 1) {
                            let newFormat = new Me.Format(docTypeId, docType[0].name, '{ "fill": "#0094ff" }');
                            formats.push(newFormat);
                        }
                    });

                    //nodes and links
                    let nodes = [];
                    let links = [];

                    let nodeIds = []; 

                    $.each(items, function (i, item) {

                        if (nodeIds.indexOf(item.parentDocID) === -1)
                            nodeIds.push(item.parentDocID);

                        //if (nodeIds.indexOf(item.childDocID) === -1)
                        //    nodeIds.push(item.childDocID);

                    });

                    let index = 0;

                    $.each(nodeIds, function (i, nodeId) {

                        let parentItem = Enumerable.From(items).Where('$.parentDocID === ' + nodeId).ToArray();
                        if (parentItem.length > 0)
                        {
                            let parentDoc = parentItem[0]; 
                            let parentIndex = index;
                            let newNode = new Me.Node(parentIndex, nodeId, 'parenthtml', parentDoc.parentTitle, parentDoc.parentDocTypeID, 30, 242, 165, 1);
                            nodes.push(newNode);

                            index++;

                            let childItems = Enumerable.From(items).Where('$.parentDocID === ' + nodeId).ToArray();

                            $.each(childItems, function (ci, childItem) {

                                let childIndex = index;
                                let newChildNode = new Me.Node(childIndex, childItem.childDocID, childItem.childContent, childItem.childTitle, childItem.childDocTypeID, 20, 342, 365, 1);
                                nodes.push(newChildNode);

                                index++;

                                //create link
                                let newLink = new Me.Link(parentIndex, childIndex);
                                links.push(newLink);

                            });
                        }
                    });

                    Me.Data = {};
                    Me.Data['formats'] = formats;
                    Me.Data['nodes'] = nodes;
                    Me.Data['links'] = links;

                    Apps.Debug.Trace(this);
                    Apps.UI.D3.Show();

                    Me.Refresh();

                });
            });
        },
        Hide: function()
        {
            Apps.Debug.Trace(this);
            Apps.UI.D3.Hide();
        },
        Refresh: function () {

            //Me.ReadD3TestData(function (data) {

                Me.DrawNodes(Me.Data);

            //});

        },
        ReadD3TestData: function (callback) {

            fetch(Apps.Settings.WebRoot + '/Scripts/Apps/Components/Docs/Modules/D3/graph.json')
                .then(response => response.text())
                .then(jsonResponse => {

                    if (callback)
                        callback(JSON.parse(jsonResponse));
                });

        },
        DrawNodes: function (data) {

            Apps.Components.VitaDocs.ClearNodes();

            var width = $('#spanAdjustmentWidth').text(),
                height = $('#spanAdjustmentHeight').text();

            var gravity = $('#spanAdjustmentGravity').text();
            var charge = $('#spanAdjustmentCharge').text();
                //left = $('#spanAdjustmentLeft').text();


            var force = d3.layout.force()
                .size([width, height])
                .charge(function (d, i) {
                    let mycharge = parseInt(charge);
                    if (i === 0) {
                        mycharge = 100 * mycharge;
                    }
                    return mycharge;
                })
                //.gravity(parseInt(gravity))
                .linkDistance(function (d, i) {
                    let distance = 150;
                    if (i === 0) {
                        distance = 2 + distance;
                    }
                    return distance;
                })
                //.lindStrength(100)
                //.friction(-500)
                .on("tick", Apps.Components.VitaDocs.tick);

            var drag = force.drag()
                .on("dragstart", Apps.Components.VitaDocs.dragstart);

            var svg = d3.select("#divD3Table").append("svg")
                .attr('class', 'maindiv')
                .style({ "border": "1px solid lightgray", "position": "absolute", "top": "65px", "left": "108px", "z-index": "300", "background": "white" })
                .attr("width", width)
                .attr("height", height);

            var svgDivs = d3.select("#divD3Table").append("divs");

            Apps.link = svg.selectAll(".link"),
                node = svg.selectAll(".node"); //.call(Apps.Components.VitaDocs.EndAll, Apps.Components.VitaDocs.DrawFinished);

            var MutationObserver = window.MutationObserver || window.WebKitMutationObserver || window.MozMutationObserver;

            //var element = document.querySelector('#test');
            //setTimeout(function () {
            //    element.setAttribute('data-text', 'whatever');
            //}, 5000)

            var observer = new MutationObserver(function (mutations) {
                mutations.forEach(function (mutation) {
                    if (mutation.type === "attributes") {
                        // console.log("attributes changed")

                        if (mutation.attributeName === "cx") {
                            //left
                            let labelElement = document.getElementById("labeldiv_" + mutation.target.id);
                            if (labelElement) {

                                let left = mutation.target.attributes["cx"].value;
                                let top = mutation.target.attributes["cy"].value;
                                let radius = mutation.target.attributes["r"].value;

                                labelElement.style.left = (parseInt(left) - (parseInt(radius) / 2)) + "px";
                                labelElement.style.top = (parseInt(top) - parseInt(radius) + 50) + "px";
                            }
                        }
                    }
                });
            });

            //var finishObserver = new MutationObserver(function (element) {

            //});
            //finishObserver.observe(document.documentElement, {
            //    childList: true,
            //    subtree: true
            //});
            //d3.json(Apps.Settings.WebRoot + '/Scripts/Apps/Components/VitaDocs/graph.json', function (error, graph) {

            //if (error) throw error;

            force
                .nodes(data.nodes)
                .links(data.links)
                .start();

            Apps.link = Apps.link.data(data.links)
                .enter().append("line")
                .attr("class", "link");


            node = node.data(data.nodes)
                .enter().append("circle")
                .attr("class", function (d, i) {
                    if (d.typeid === 1) {
                        return "node node1";
                    }
                    else if (d.typeid === 2) {
                        return "node node2";
                    }
                    else if (d.typeid === 3) {
                        return "node node3";
                    }
                    else if (d.typeid === 4) {
                        return "node node4";
                    }
                })
                .attr("id", function (d, i) { return d.id; })
                .attr("r", function (d) { return d.w; })
                //.on("dblclick", dblclick)
                .on('mouseover', function (d, i) {
                    Apps.Notify('success', d.name);
                })
                .on("click", function (d, i) {

                    $('#editorContainer').jqte();

                    $('.jqte').css('width', '802px').css('height', '464px').css('position', 'relative').css('top', '-22px').css('border-color', 'lightblue');
                    $('.jqte_editor').height('498px');
                    $('.jqte_editor').html(d.html);

                    $("#cover").animate({ opacity: 1, top: "10px" }, 600);

                    $('#coverbutton').off().on('click', function (event) {

                        //save content
                        var doc = {
                            DocHtml: $('.jqte_editor')[0].innerHTML,
                            VirtualFolder: Apps.Settings.VirtualFolder,
                            DocID: d.id
                        };

                        Apps.Util.PostWithData('api/VitaDocs/SaveDoc', JSON.stringify(doc), function (error, result) {
                            Apps.Notify('success', 'Saved!');
                            $('.jqte_editor').html('');
                        });

                    });

                    $("#cover").off().on("click", function (event) {

                        if (
                            $(event.target).hasClass('jqte') ||
                            $(event.target).hasClass('jqte_editor') ||
                            $(event.target).hasClass('jqte_toolbar') ||
                            $(event.target).hasClass('jqte_tool_icon')
                        ) {
                            //clicking on editor, cancel click
                        }
                        else {
                            $("#cover").animate({ opacity: 0, top: "800px" }, 600);

                        }


                    });
                })
                .call(drag);


            var circles = document.getElementsByClassName("node");

            for (let element of circles) //circles.forEach(function (element) {
            {
                //if ($(element).hasClass('node1')) {
                observer.observe(element, {
                    attributes: true //configure it to listen to attribute changes
                });
                //}
            }

            //node.append("text")
            //    .attr("x", 0)
            //    .attr("dy", ".35em")
            //    .attr('text-anchor', 'middle')
            //    .attr('dominant-baseline', 'central')
            //    .style('font-family', 'FontAwesome')
            //    .style('font-size', '20px')
            //    .text(function (d) { return d.name; });

            //var nodes = svg.append("g")
            //    .attr("class", "nodes")
            //    .selectAll("circle")
            //    .data(data.nodes)
            //    .enter()
            //    .append("circle")
            //    .attr("class", "node")
            //    .attr("cx", function (d, i) {
            //        return (i * 70) + 50;
            //    })
            //    .attr("cy", height / 2)
            //    .attr("r", 50);

            var labels = svgDivs.append("divs")
                .attr("class", "doclabels")
                //.style("display", "none")
                .selectAll("text")
                .data(data.nodes)
                .enter()
                .append("text")
                //.style({
                //    position: "absolute", "left": function (d, i)
                //    {
                //        let result = "20px";
                //        let nodeElement = document.querySelectorAll('[id="' + d.id + '"]'); //document.getElementById(d.id);
                //        if (nodeElement.length === 1) {
                //            if (nodeElement[0].attributes["cx"]) {
                //                let rect = nodeElement[0].attributes["cx"].value; // nodeElement.getBoundingClientRect();
                //                result = rect + "px";
                //            }
                //        }
                //        return d.cx + "px";
                //    }, "top": function (d, i) { return d.y + "px"; }
                //})
                .attr("id", function (d, i) { return "labeldiv_" + d.id; })
                .style({ position: "absolute", "font-size": "10px", "font-family": "cursive", "z-index": "300" })
                .text(function (d) {
                    return d.name;
                });
            //.transition().each('end', Apps.Components.VitaDocs.DrawFinished);

            //if (callback)
            //    callback();
            //  });

            //Apps.Util.Center($('#maindiv'));

        },
        Event: function (sender, args, callback)
        {
            //TODO: change pages to components if a top-level
            Apps.Debug.Trace(this, 'D3 Event: ' + sender);

            switch (sender)
            {
                case 'view':

                    Me.Show();
                    break;

                case 'hide':

                    Apps.Pages.D3.Hide();
                    break;
                case 'width_adjustment_up':

                    let currentWidthUp = parseInt($('#spanAdjustmentWidth').text());
                    $('#spanAdjustmentWidth').text(currentWidthUp + 50);

                    Me.Refresh();

                    break;

                case 'width_adjustment_down':

                    let currentWidthDown = parseInt($('#spanAdjustmentWidth').text());
                    $('#spanAdjustmentWidth').text(currentWidthDown - 50);

                    Me.Refresh();

                    break;

                case 'height_adjustment_up':

                    let currentHeightUp = parseInt($('#spanAdjustmentHeight').text());
                    $('#spanAdjustmentHeight').text(currentHeightUp + 50);

                    Me.Refresh();

                    break;

                case 'height_adjustment_down':

                    let currentHeightDown = parseInt($('#spanAdjustmentHeight').text());
                    $('#spanAdjustmentHeight').text(currentHeightDown - 50);

                    Me.Refresh();

                    break;

                case 'gravity_adjustment_up':

                    let currentGravityUp = parseInt($('#spanAdjustmentGravity').text());
                    $('#spanAdjustmentGravity').text(currentGravityUp + 50);

                    Me.Refresh();

                    break;

                case 'gravity_adjustment_down':

                    let currentGravityDown = parseInt($('#spanAdjustmentGravity').text());
                    $('#spanAdjustmentGravity').text(currentGravityDown - 50);

                    Me.Refresh();

                    break;

                case 'charge_adjustment_up':

                    let currentChargeUp = parseInt($('#spanAdjustmentCharge').text());
                    $('#spanAdjustmentCharge').text(currentChargeUp + 50);

                    Me.Refresh();

                    break;

                case 'charge_adjustment_down':

                    let currentChargeDown = parseInt($('#spanAdjustmentCharge').text());
                    $('#spanAdjustmentCharge').text(currentChargeDown - 50);

                    Me.Refresh();

                    break;
             
            }
        },
        Format: function (idParam, nameParam, styleParam) {
            this.id = idParam; this.name = nameParam; this.style = styleParam;
            return this;
        },
        Node: function (indexParam, idParam, htmlParam, nameParam, typeidParam, wParam, xParam, yParam, zParam) {
            this.index = indexParam; this.id = idParam; this.html = htmlParam; this.name = nameParam; this.typeid = typeidParam; this.w = wParam; this.x = xParam; this.y = yParam; this.z = zParam;
            return this;
        },
        Link: function (sourceParam, targetParam) {
            this.source = sourceParam; this.target = targetParam;
            return this;
        }
    };
    return Me;
})
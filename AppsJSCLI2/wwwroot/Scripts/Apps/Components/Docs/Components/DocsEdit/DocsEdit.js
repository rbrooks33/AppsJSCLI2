define([], function () {
    var Me = {
        Enabled: true,
        Color: 'blue',
        Name: 'DocsEdit',
        Doc: null,
        SelectedFile:null,
        Initialize: function () {

            Apps.Debug.Trace(this);

            //Apps.LoadTemplate('DocsEdit', Apps.Settings.WebRoot + '/' + Apps.Settings.AppsRoot + '/AutoComponents/DocsEdit/DocsEdit.html', function () {

            //    Apps.LoadStyle(Apps.Settings.WebRoot + '/' + Apps.Settings.AppsRoot + '/Components/DocsEdit/DocsEdit.css');
            //    Apps.Components.DocsEdit.Event('view');
            //});

        },
        Show: function(doc)
        {

            doc = JSON.parse(unescape(doc));
            Me.Doc = doc;

            Apps.Debug.Trace(this);
            Apps.UI.DocsEdit.Show();
            Apps.Util.CenterAbsolute($('#divDocsEditContent'));

            $('#txtDocContent').jqte();
            $('.jqte_editor').css('min-height', '300px');

            $('#spanDocsEdit_DocName').text('Edit Doc #' + doc.DocID);
            $('#DocsEdit_DocDates').text('Created ' + Apps.Util.FormatDateTime2(doc.Created) + ' Last Updated ' + Apps.Util.FormatDateTime2(doc.Updated));
            $('#txtDocTitle').val(doc.DocTitle);
            $('.jqte_editor').html(doc.DocContent);

            $('#btnSaveDoc').off().on('click',function (event) {
                var buttonDoc = doc;
                Apps.AutoComponents.Docs.Save(buttonDoc);
            });

            $('#btnArchiveDoc').off().on('click', function (event) {

                if (confirm('Are you sure?')) {
                    var buttonDoc = doc;
                    buttonDoc.Archived = true;
                    Apps.AutoComponents.Docs.Save(buttonDoc);
                }
            });
            //Tags
            Me.Event('refresh_tags');

            Apps.Util.Get('/api/Docs/GetTags', function (error, result) {
                Apps.Util.RefreshCombobox(result.Data, 'DocsEdit_selectDocsEditTags', 0, 'Select a Tag', 'TagID', 'Name', function (error, result) {
                    //on change
                    let selectedTagId = $('#DocsEdit_selectDocsEditTags').val();
                    if (selectedTagId > 0) {
                        Apps.Util.Get('/api/Docs/UpsertDocTags?docId=' + Me.Doc.DocID + '&tagId=' + selectedTagId, function (error, result) {

                            Apps.Notify('success', 'New tag added!');
                            Me.Event('refresh_tags');

                        });
                    }
                });
            });
            //Set upload iframe source
            $('#iframeUploadForm').attr('src', Apps.Settings.WebRoot + '/Scripts/Apps/AutoComponents/Docs/Modules/DocsEdit/fileupload.html');

            Me.Event('cancel_new_file');
            Me.Event('refresh_files');
        },
        Hide: function()
        {
            Apps.Debug.Trace(this);
            Apps.UI.DocsEdit.Hide();
        },
        RefreshFiles: function () {
            Apps.Pages.DocsEdit.Event('refresh_files');
        },
        removeDuplicates: function (str) {
            //input string eg AbraCadABraAlakAzam
            //response: "AbrCdlkzm"
            //only case insensitive alpha
            let result = '';
            for (var x = 0; x < str.length; x++) {

                if (result.indexOf(str[x].toLowerCase()) === -1)
                    result += str[x];
            }
            console.log(result);
        },
        Event: function (sender, args) {
            Apps.Debug.Trace(this, 'DocsEdit Event: ' + sender);

            switch (sender) {
                case 'view':

                    Me.Show();
                    break;

                case 'hide':

                    Apps.Pages.DocsEdit.Hide();
                    break;

                case 'refresh_tags':

                    Apps.Util.Get('/api/Docs/GetDocTags?docId=' + Me.Doc.DocID, function (error, result) {
                        $('#DocsEdit_docTags').empty();
                        $.each(result.Data, function (index, tag) {
                            let docTagHtml = '<span class="badge badge-light">' + tag.Name + '</span>';
                            docTagHtml += '<span style="cursor:pointer;" onclick="Apps.Pages.DocsEdit.Event(\'remove_doctag\',' + Me.Doc.DocID + ',' + tag.TagID + ');">X</span>';
                            $('#DocsEdit_docTags').append(docTagHtml);
                        });

                    });
                    break;
                case 'remove_doctag':

                    let removeDocId = arguments[1];
                    let removeTagId = arguments[2];

                    Apps.Util.Get('/api/Docs/RemoveDocTag?docId=' + removeDocId + '&tagId=' + removeTagId, function (error, result) {
                        Me.Event('refresh_tags');
                    });
                    break;

                case 'show_upload_files':

                    let iframe = $($('#iframeUploadForm')[0].contentDocument);
                    
                    let nBytes = 0;
                    let oFiles = iframe.find('#uploadInput')[0].files;
                    let nFiles = oFiles.length;

                    for (let nFileId = 0; nFileId < nFiles; nFileId++) {
                        nBytes += oFiles[nFileId].size;
                    }
                    let sOutput = nBytes + " bytes";
                    // optional code for multiples approximation
                    for (let aMultiples = ["KiB", "MiB", "GiB", "TiB", "PiB", "EiB", "ZiB", "YiB"], nMultiple = 0, nApprox = nBytes / 1024; nApprox > 1; nApprox /= 1024, nMultiple++) {
                        sOutput = nApprox.toFixed(3) + " " + aMultiples[nMultiple] + " (" + nBytes + " bytes)";
                    }
                    // end of optional code
                    iframe.find('#fileNum')[0].innerHTML = nFiles;
                    iframe.find('#fileSize')[0].innerHTML = sOutput;

                    $(iframe.find('#uploadDocID')[0]).val(Me.Doc.DocID);

                    $(iframe.find('#uploadForm')[0]).on('submit', function (e) {
                        
                        Apps.Pages.DocsEdit.Event('cancel_new_file');
                        setTimeout(Apps.Pages.DocsEdit.RefreshFiles, 2000);
                    });
                    break;
                case 'upload_files':

                    let iframe2 = $($('#iframeUploadForm')[0].contentDocument);
                  // let uploadedFiles = document.getElementById("uploadInput").files;

                    //var formData = new FormData();
                    //formData.append('files', uploadedFiles);
                    let uploadForm = iframe2.find('#uploadForm')[0];
                    let friendlyName = $(iframe2.find('#uploadFriendlyName')[0]).val(); // $('#uploadFriendlyName').val();
                    let description = $(iframe2.find('#uploadDescription')[0]).val(); //$('#uploadDescription').val();

                    uploadForm.method = 'post';
                    uploadForm.enctype = 'multipart/form-data';

                    uploadForm.action = Apps.Settings.WebRoot + '/api/Docs/UploadFiles?docId=' + Me.Doc.DocID + '&friendlyName=' + friendlyName + '&description=' + description;
                    //uploadForm.onsubmit = Apps.Pages.DocsEdit.Event('formsubmit');
                    try {
                        $(iframe2.find('#uploadForm')[0]).trigger('submit');  //$('#uploadForm').trigger('submit');
                    }
                    catch (err) {
                        let test = "hiya";
                    }

                    break;

                case 'formsubmit': //called by upload

                    event.preventDefault();
                    break;

                case 'new_file':

                    $('#iframeUploadForm').show(300);
                    $('#iframeUploadForm').attr('src', Apps.Settings.WebRoot + '/Scripts/Apps/AutoComponents/Docs/Modules/DocsEdit/fileupload.html');

                    if (args)
                        args();

                    break;

                case 'cancel_new_file':

                    $('#iframeUploadForm').hide(300);
                    $('#iframeUploadForm').attr('src',  '');

                    break;

                case 'refresh_files':

                    Apps.Util.Get(Apps.Settings.WebRoot + '/api/Docs/GetFilesByDocID?docId=' + Me.Doc.DocID, function (error, result) {

                        let unarchived = Enumerable.From(result.Data).Where(function (df) { return df.Archived === false; }).ToArray();

                        let filesTable = '<table>';
                        $.each(unarchived, function (index, file) {
                            filesTable += '<tr>';
                            filesTable += '    <td style="vertical-align:top;">';
                            filesTable += '#' + file.DocFileID;
                            filesTable += '    </td>';
                            filesTable += '    <td>';
                            filesTable += '        <a href="' + Apps.Settings.WebRoot + '/Images/Uploads/' + file.Name + file.Extension + '" target="_none">';
                            if (file.Extension.toLowerCase() === '.pdf') {
                                filesTable += '            <img src="' + Apps.Settings.WebRoot + '/Images/pdf.png" width="100" />';
                            }
                            else
                                filesTable += '            <img src="' + Apps.Settings.WebRoot + '/Images/Uploads/' + file.Name + file.Extension + '" width="100" />';
                            filesTable += '        </a>';
                            filesTable += '    </td>';
                            filesTable += '    <td style="vertical-align:top;">';
                            filesTable += file.FriendlyName;
                            filesTable += '    </td>';
                            filesTable += '    <td style="vertical-align:top;">';
                            filesTable += file.Description;
                            filesTable += '    </td>';
                            filesTable += '    <td style="vertical-align:top;">';
                            filesTable += file.Size + ' bytes';
                            filesTable += '    </td>';
                            filesTable += '    <td style="vertical-align:top;">';
                            filesTable += file.FileExists ? 'On Disk' : 'Not On Disk';
                            filesTable += '    </td>';
                            filesTable += '    <td style="vertical-align:top;">';
                            filesTable += '        <div class="btn-group">';
                            filesTable += '            <div onclick="Apps.Pages.DocsEdit.Event(\'edit_file\', \'' + escape(JSON.stringify(file)) + '\');" class="btn btn-primary btn-sm">Edit</div>';
                            filesTable += '            <div onclick="Apps.Pages.DocsEdit.Event(\'delete_file\', \'' + escape(JSON.stringify(file)) + '\');" class="btn btn-primary btn-sm">Delete</div>';
                            filesTable += '        </div>';
                            filesTable += '    </td>';
                            filesTable += '</tr>';
                        });
                        filesTable += '</table>';

                        $('#divDocFilesContainer').html(filesTable);
                    });


                    break;

                case 'edit_file':

                    let openDocFile = JSON.parse(unescape(args));
                    Me.SelectedFile = openDocFile; //for save

                    Me.Event('new_file', function () {

                        setTimeout(function () {

                            let iframeEdit = $($('#iframeUploadForm')[0].contentDocument);
                            $(iframeEdit.find('#uploadFriendlyName')[0]).val(openDocFile.FriendlyName); // $('#uploadFriendlyName').val();
                            $(iframeEdit.find('#uploadDescription')[0]).val(openDocFile.Description); //$('#uploadDescription').val();

                            Apps.Notify('success', 'editing ' + openDocFile.FriendlyName);

                        }, 1000);
                    });


                    break;

                case 'save_file':

                    if (Me.SelectedFile) {

                        let iframeEdit = $($('#iframeUploadForm')[0].contentDocument);
                        Me.SelectedFile.FriendlyName = $(iframeEdit.find('#uploadFriendlyName')[0]).val(); // $('#uploadFriendlyName').val();
                        Me.SelectedFile.Description = $(iframeEdit.find('#uploadDescription')[0]).val(); 

                        Apps.Util.PostWithData(Apps.Settings.WebRoot + '/api/Docs/UpsertDocFile', JSON.stringify(Me.SelectedFile), function () {

                            Apps.Notify('success', 'Saved ' + Me.SelectedFile.FriendlyName);
                            Me.Event('cancel_new_file');
                            Me.RefreshFiles();

                        });

                    }

                    break;

                case 'delete_file':

                    if (confirm('Delete?')) {
                        let deleteDocFile = JSON.parse(unescape(args));
                        deleteDocFile.Archived = true;


                        Apps.Util.PostWithData(Apps.Settings.WebRoot + '/api/Docs/UpsertDocFile', JSON.stringify(deleteDocFile), function () {

                            Apps.Notify('success', 'Archived ' + deleteDocFile.FriendlyName);
                            Me.RefreshFiles();
                        });
                    }
                    break;
                
            }
        }
    };
    return Me;
})
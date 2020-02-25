define([], function () {
    var Me = {
     
        Initialize: function(objectName)
        {
            ///HANDLERS
            //$('#btnBackToCustomer').click(function (e) {
            //    document.location.href = '../../../customerhome?customerId=' + customer.CustomerID;
            //}).val('Back To ' + customer.CustomerName);

            //$('#btnBackToProject').click(function (e) {
            //    document.location.href = '../../../projecthome?projectId=' + project.ProjectID;
            //});

            $('#btnAddProjectDoc').click(function (e) {
                Apps.AutoComponents.Docs.Add();
            });

            $('#btnExpand').click(function (e) {
                Apps.AutoComponents.Docs.Expand();
            });

            $('#btnCollapse').click(function (e) {
                Apps.AutoComponents.Docs.Collapse();
            });

            $('#divPageTitle').text(objectName + ' Docs');
            //$('#divPageSubTitle').text(customer.CustomerName + ' project documentation');


        }
    };
    return Me;
})
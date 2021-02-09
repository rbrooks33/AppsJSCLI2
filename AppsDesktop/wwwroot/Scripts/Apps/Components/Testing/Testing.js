define([], function () {
    var Me = {
        Enabled: true,
        Color: 'blue',
        Name: 'Testing',
        Initialize: function (callback) {

            Apps.LoadTemplate('Testing', Apps.Settings.WebRoot + '/' + Apps.Settings.AppsRoot + '/Components/Testing/Testing.html', function () {

                Apps.LoadStyle(Apps.Settings.WebRoot + '/' + Apps.Settings.AppsRoot + '/Components/Testing/Testing.css');

                Apps.Components.Testing.Event('view');

                //In case one needs to manually re-initialize and do something
                if (callback)
                    callback();
            });

        },
        
        Show: function()
        {
            Apps.UI.Testing.Show();
        },
        Hide: function()
        {
            Apps.UI.Testing.Hide();
        },
        Test: function (type) {

            var SetValue = Me.SetValue;
            var SetIndex = Me.SetIndex;
            var SetRadio = Me.SetRadio;

            if (location.href.includes('http://localhost:52780/MH/MHApp.html'))
                type = 'mhapp';
            else if (location.href.includes('http://localhost:52780/Dwelling/DWApp.html'))
                type = 'dwapp';
            else if (location.href.includes('http://localhost:52780/Home/HOApp.html'))
                type = 'hoapp';

                switch (type) {

                    case 'mhapp':

                        SetValue('main2sub0prefix9', 'Mr.');
                        SetValue('main2sub0first9', 'Rod');
                        SetValue('main2sub0middle9', 'A');
                        SetValue('main2sub0last9', 'Brock');
                        SetValue('effdatemmddyyyy7', '1/1/2020');

                        SetIndex('covaselect', 5);
                        SetIndex('covaselect', 0);
                        SetIndex('propertyowner', 1);

                        SetValue('consYYYY4', '1950');
                        SetValue('sqft', '2300');
                        SetIndex('heatfuel', 0);
                        SetIndex('heattype', 0);
                        SetValue('roofYYYY4', '1990');
                        SetIndex('rooftype', 0);
                        SetIndex('foundation', 0);
                        SetValue('quzip', '73101');
                        SetValue('fdname', 'jones fd');

                        SetRadio('busknob1');
                        SetRadio('dcknob0');

                        SetValue('main2sub0address', '123 Main st.');
                        SetValue('main2sub0city', 'jones');
                        SetValue('main2sub0zip', '73101-0000');
                        SetValue('main2sub0mmddyyyy8', '1/1/1923');
                        SetValue('main2sub0ssn8', '435446789');
                        SetValue('main2sub0ph8', '3456765565');
                        SetValue('main2sub0employer', 'Tapps');
                        SetValue('main2sub0tij', '1/1/2020');
                        SetValue('main2sub0wkph8', '3454565678');
                        SetValue('main2sub0occupation', 'developer');

                        SetIndex('pst', 0);
                        SetValue('make', 'windmere');
                        SetValue('model', 'x20');
                        SetValue('dimensions', '20x50');
                        SetValue('address', '123 Main St.');
                        SetValue('home1city', 'jones');
                        SetValue('zip', '73101-0000');
                        SetValue('home1legal', 'legal name');
                        SetValue('elecYYYY4', '1990');
                        SetValue('plumYYYY4', '2000');
                        SetValue('heatYYYY4', '2000');
                        SetValue('roofYYYY4', '2000');
                        SetIndex('gartype', 0);
                        SetValue('gsqft', '500');
                        SetValue('pdatmmddyyyy4', '1/1/1950');
                        SetValue('purprice', '50000');
                        SetValue('improve', '1000');
                        SetValue('hmvalue', '100000');

                        SetRadio('q1knob0');
                        SetRadio('q2knob0');
                        SetRadio('q3knob0');
                        SetRadio('q4knob0');
                        SetRadio('q9aknob0');

                        SetRadio('q5knob0');
                        SetRadio('q7knob0');
                        SetRadio('q8knob0');
                        SetRadio('q10knob0');
                        SetRadio('q11knob0');
                        SetRadio('q12knob0');
                        SetRadio('q13knob0');
                        SetRadio('q5knob0');

                        SetRadio('mhtranknob0');
                        SetRadio('q18knob0');
                        SetRadio('q19knob1');
                        SetRadio('q20knob1');
                        SetRadio('q21knob1');
                        SetRadio('q22aknob1');


                        break;

                    case 'dwapp':

                        SetValue('main2sub0prefix9', 'Mr.');
                        SetValue('main2sub0first9', 'Rod');
                        SetValue('main2sub0middle9', 'A');
                        SetValue('main2sub0last9', 'Brock');
                        SetValue('effdatemmddyyyy7', '1/1/2020');

                        SetIndex('m110covaselect', 4);
                        SetIndex('m110type', 1);
                        SetIndex('m110conclass', 1);
                        SetIndex('home1seasonal', 0);
                        SetIndex('home1propertyowner', 1);
                        SetValue('m110consYYYY8', '1950');
                        SetValue('m110sqft', '2300');
                        SetIndex('m110heatfuel', 0);
                        SetIndex('m110heattype', 0);
                        SetValue('m110roofYYYY8', '2000');
                        SetIndex('m110rooftype', 0);
                        SetIndex('m110foundation', 0);
                        SetValue('home1elecYYYY9', '1990');
                        SetValue('m110roofYYYY8', '1990');
                        SetValue('home1quzip', '73101');
                        SetValue('m110fdname', 'ib');
                        SetValue('main2sub0address', '123 Main St.');
                        SetValue('main2sub0mmddyyyy8', '1/1/1923');
                        SetValue('main2sub0city', 'jones');
                        SetValue('main2sub0zip', '73101-0000');
                        SetValue('main2sub0ssn8', '343234345');
                        SetValue('main2sub0ph8', '4534434444');
                        SetValue('main2sub0employer', 'Tapps');
                        SetIndex('pst0', 0);
                        SetValue('main2sub0tij', '1/1/2020');
                        SetValue('main2sub0wkph8', '3324454532');
                        SetValue('main2sub0occupation', 'developer');
                        SetValue('main2sub0prev0sub0employer', 'RHI');
                        SetValue('main2sub0prev0sub0start', '1/1/2019');
                        SetValue('main2sub0prev0sub0end', '1/1/2020');
                        SetValue('home1make', 'Windemere');
                        SetValue('home1model', 'X2000');
                        SetValue('home1dimensions', '20x30');
                        SetValue('home1address', '123 Main St.');
                        SetValue('home1city', 'jones');
                        SetValue('home1zip', '73101-0000');
                        SetValue('home1legal', 'Lot 245345');
                        SetValue('home1pdatmmddyyyy9', '1/1/1950');
                        SetValue('home1purprice', '50000');
                        SetValue('home1improve', '1000');
                        SetValue('home1value', '100000');

                        SetRadio('home1q7aknob1');
                        SetRadio('home1q7bknob1');
                        SetRadio('home1q1knob0');
                        SetRadio('home1q2knob0');
                        SetRadio('home1q3knob0');
                        SetRadio('home1q4knob0');
                        SetRadio('home1q5knob0');
                        SetRadio('home1q6knob0');
                        SetRadio('home1q8knob0');
                        SetRadio('home1q9aknob1');
                        SetRadio('d1tranknob0');

                        SetIndex('home1gartype', 0);
                        SetValue('home1gsqft', '500');
                        SetValue('home1plumYYYY9', '1990');
                        SetValue('home1heatYYYY9', '1990');

                        SetRadio('qa1knob0');
                        SetRadio('qa1knob0');
                        SetRadio('qa7knob1');
                        SetRadio('qa8knob1');
                        SetRadio('qa9knob1');

                        SetRadio('home1q9aknob1');
                        break;

                    case 'hoapp':

                        SetValue('namedprefix5', 'Mr.');
                        SetValue('namedfirst5', 'Rodney');
                        SetValue('namedmiddle5', 'A');
                        SetValue('namedlast5', 'Brooks');
                        SetValue('effdatemmddyyyy7', '12/12/2020');
                        document.getElementById('conclass').selectedIndex = 1;
                        document.getElementById('covaselect').selectedIndex = 4;
                        SetValue('yearYYYY4', '1950');
                        SetValue('sqft', '2300');
                        SetValue('roofYYYY4', '1990');
                        SetValue('appinfoxxxxx7', '73101');
                        SetValue('fdname', 'IB');
                        SetValue('main2sub0address', '123 Elder Ave.');
                        SetValue('main2sub0mmddyyyy8', '1/1/1940');
                        SetValue('main2sub0city', 'jones');
                        SetValue('main2sub0zip', '73101-0000');
                        SetValue('main2sub0ssn8', '453657654');
                        SetValue('main2sub0ph8', '4325678909');
                        SetValue('main2sub0employer', 'Workplace Inc.');
                        SetValue('main2sub0tij', '1/1/2020');
                        SetValue('main2sub0wkph8', '3456789878');
                        SetValue('main2sub0occupation', 'Supervisor');
                        SetValue('main0sub0address', '123 Main St.');
                        SetValue('main0sub0city', 'jones');
                        SetValue('main0sub0zip', '73101-0000');
                        document.getElementById('pst').selectedIndex = 1;
                        document.getElementById('gtype').selectedIndex = 2;
                        SetValue('gsqft', '500');
                        SetValue('appplumYYYY7', '1990');
                        SetValue('appelecYYYY7', '1990');
                        SetValue('appheatYYYY7', '1990');
                        SetValue('appfdname', 'IB');
                        document.getElementById('propertyowner').selectedIndex = 1;
                        document.getElementById('seasonal').selectedIndex = 0;
                        SetValue('hmpurdatemmddyyyy9', '1/1/1950');
                        SetValue('hmpurprice', '50000');
                        SetValue('hmimprove', '1000');
                        SetValue('hmvalue', '100000');
                        document.getElementById('main2sub0sub1sub0knob0').checked = true;

                        document.getElementById('qa1knob0').checked = true;
                        document.getElementById('qa2knob0').checked = true;
                        document.getElementById('qa6knob0').checked = true;
                        document.getElementById('qa7knob1').checked = true;
                        document.getElementById('qa8knob1').checked = true;
                        document.getElementById('qa9knob1').checked = true;

                        document.getElementById('q1knob0').checked = true;
                        document.getElementById('q4knob0').checked = true;
                        document.getElementById('q5knob0').checked = true;
                        document.getElementById('q11knob0').checked = true;
                        document.getElementById('q9aknob0').checked = true;

                        document.getElementById('q12knob0').checked = true;
                        document.getElementById('q13aknob1').checked = true;
                        document.getElementById('q13bknob1').checked = true;
                        document.getElementById('q14knob0').checked = true;
                        //document.getElementById('q14knob0').checked = true; //bus 
                        document.getElementById('q19knob0').checked = true;
                        document.getElementById('q20aknob1').checked = true;

                        document.getElementById('hotranknob0').checked = true;

                        break;
                }
            },

            SetValue: function (elementId, val) {
                try {
                    F('#' +elementId).visible()[0].value = val;
                }
                catch (err) {
                    console.error(err);
                }
            },
            SetIndex: function(elementId, index) {
                try {
                    F('#' + elementId).visible()[0].selectedIndex = index;
                }
                catch (err) {
                    console.error(err);
                }
            },
        SetRadio: function (elementId) {
            try {

                F('#' + elementId).visible()[0].checked = true;
            }
            catch (err) {
                console.error(err);
            }
            },
        Event: function (sender, args, callback)
        {
            switch (sender)
            {
                case 'open_testing':

                    Apps.Components.VitaTest.TestManager.Show();

                    break;

            }
        }

    };
    return Me;
})
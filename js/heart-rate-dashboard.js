function makeDashboard(chart){
    chart.innerHTML = '';
    function getData() {
        return Math.random()
    }
    var traces = [
        {x: [], y:[], type:'line', name: 'Heart rate'}
    ]
    const layout = {
        showlegend: false,
        yaxis: {title: 'beats per minute'},
        title: 'Heart Rate'
    }
    const options = {displayModeBar: false}
    
    let myPlot = null;
    const processInfo = (info) => {
        if(info){
            if(!myPlot){
                chart.innerHTML = '';
                myPlot = Plotly.plot(chart.id, traces, layout, options);
            }
            Plotly.extendTraces(chart.id, {y:[[info.heartRate]], x: [[new Date()]]}, [0])
        }
    }
    const processMessage = (msg) => {
        if(!myPlot)chart.innerHTML = msg;
        else console.log(msg)
    }
    HeartRateMonitor(processInfo, processMessage)
}

let d = document.querySelector('#chart');
d.addEventListener('click', () => makeDashboard(d));

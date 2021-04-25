function makeDashboard(chart){
    chart.innerHTML = '';
    function getData() {
        return Math.random()
    }
    var traces = [
        {x: [], y:[], type:'line', name: 'Heart rate'},
        {x: [], y:[], type: 'line', name: 'Intervals'}
    ]
    const layout = {
        showlegend: false,
        yaxis: {title: 'beats per minute'},
        title: 'Heart Rate'
    }
    const options = {displayModeBar: false}
    
    let myPlot = null;
    const hr = [];
    const intervals = [];
    const processInfo = (info) => {
        
        if(info){
            if(!myPlot){
                chart.innerHTML = '';
                myPlot = Plotly.plot(chart.id, traces, layout, options);
            }
            Plotly.extendTraces(chart.id, {y:[[info.heartRate]],  x: [[new Date()]]}, [0])
            for(const v of info.intervals)intervals.push(v);
        }
    }
    const processMessage = (msg) => {
        if(!myPlot)chart.innerHTML = msg;
        else console.log(msg)
    }
    document.body.addEventListener('copy', (e) => {
        e.clipboardData.setData('text/plain', 'intervals\n' + intervals.join('\n'))
        e.preventDefault();
        e.stopPropagation();
    })
    HeartRateMonitor(processInfo, processMessage)
}

let d = document.querySelector('#chart');
d.addEventListener('click', () => makeDashboard(d));


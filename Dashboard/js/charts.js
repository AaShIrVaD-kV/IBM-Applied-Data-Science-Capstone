// Load data dynamically and plot Plotly charts
document.addEventListener("DOMContentLoaded", function() {
    // 1. Success Rate by Orbit Type
    fetch('data/dataset_part_2.json')
        .then(response => response.json())
        .then(data => {
            plotOrbitSuccessRate(data);
            plotFlightVsLaunchSite(data);
            plotPayloadVsLaunchSite(data);
            plotYearlyTrend(data);
        });
        
    // 2. Model performance charts
    fetch('data/model_performance.json')
        .then(response => response.json())
        .then(data => {
            plotModelAccuracy(data);
        });
});

function plotOrbitSuccessRate(data) {
    let orbitSuccess = {};
    let orbitCount = {};
    
    data.forEach(d => {
        if (!orbitSuccess[d.Orbit]) {
            orbitSuccess[d.Orbit] = 0;
            orbitCount[d.Orbit] = 0;
        }
        orbitSuccess[d.Orbit] += d.Class;
        orbitCount[d.Orbit] += 1;
    });
    
    let orbits = [];
    let rates = [];
    
    for (let o in orbitSuccess) {
        orbits.push(o);
        rates.push(orbitSuccess[o] / orbitCount[o]);
    }
    
    // Sort descending
    let sortedIndices = rates.map((r, i) => i).sort((a, b) => rates[b] - rates[a]);
    let sortedOrbits = sortedIndices.map(i => orbits[i]);
    let sortedRates = sortedIndices.map(i => rates[i]);
    
    let trace = {
        x: sortedOrbits,
        y: sortedRates,
        type: 'bar',
        marker: {
            color: '#ff3b30',
            opacity: 0.8
        }
    };
    
    let layout = {
        title: {
            text: 'Success Rate by Orbit Type',
            font: { color: '#f5f5f7', size: 16 }
        },
        paper_bgcolor: 'rgba(0,0,0,0)',
        plot_bgcolor: 'rgba(0,0,0,0)',
        xaxis: { gridcolor: 'rgba(255,255,255,0.05)', tickfont: { color: '#8e8e93' } },
        yaxis: { range: [0, 1.1], gridcolor: 'rgba(255,255,255,0.05)', tickfont: { color: '#8e8e93' } }
    };
    
    Plotly.newPlot('orbitSuccessChart', [trace], layout, {responsive: true});
}

function plotFlightVsLaunchSite(data) {
    let trace1 = {
        x: data.filter(d => d.Class === 1).map(d => d.FlightNumber),
        y: data.filter(d => d.Class === 1).map(d => d.LaunchSite),
        mode: 'markers',
        name: 'Landed',
        marker: { color: '#4cd964', size: 12, symbol: 'circle' }
    };
    
    let trace2 = {
        x: data.filter(d => d.Class === 0).map(d => d.FlightNumber),
        y: data.filter(d => d.Class === 0).map(d => d.LaunchSite),
        mode: 'markers',
        name: 'Failed',
        marker: { color: '#ff3b30', size: 12, symbol: 'x' }
    };
    
    let layout = {
        title: {
            text: 'Flight Number vs Launch Site',
            font: { color: '#f5f5f7', size: 16 }
        },
        paper_bgcolor: 'rgba(0,0,0,0)',
        plot_bgcolor: 'rgba(0,0,0,0)',
        xaxis: { title: 'Flight Number', gridcolor: 'rgba(255,255,255,0.05)', tickfont: { color: '#8e8e93' }, titlefont: { color: '#f5f5f7' } },
        yaxis: { gridcolor: 'rgba(255,255,255,0.05)', tickfont: { color: '#8e8e93' } },
        legend: { font: { color: '#f5f5f7' } }
    };
    
    Plotly.newPlot('flightVsLaunchChart', [trace1, trace2], layout, {responsive: true});
}

function plotPayloadVsLaunchSite(data) {
    let trace1 = {
        x: data.filter(d => d.Class === 1).map(d => d.PayloadMass),
        y: data.filter(d => d.Class === 1).map(d => d.LaunchSite),
        mode: 'markers',
        name: 'Landed',
        marker: { color: '#4cd964', size: 12 }
    };
    
    let trace2 = {
        x: data.filter(d => d.Class === 0).map(d => d.PayloadMass),
        y: data.filter(d => d.Class === 0).map(d => d.LaunchSite),
        mode: 'markers',
        name: 'Failed',
        marker: { color: '#ff3b30', size: 12 }
    };
    
    let layout = {
        title: {
            text: 'Payload Mass vs Launch Site',
            font: { color: '#f5f5f7', size: 16 }
        },
        paper_bgcolor: 'rgba(0,0,0,0)',
        plot_bgcolor: 'rgba(0,0,0,0)',
        xaxis: { title: 'Payload Mass (kg)', gridcolor: 'rgba(255,255,255,0.05)', tickfont: { color: '#8e8e93' }, titlefont: { color: '#f5f5f7' } },
        yaxis: { gridcolor: 'rgba(255,255,255,0.05)', tickfont: { color: '#8e8e93' } },
        legend: { font: { color: '#f5f5f7' } }
    };
    
    Plotly.newPlot('payloadVsLaunchChart', [trace1, trace2], layout, {responsive: true});
}

function plotYearlyTrend(data) {
    let yearlySuccess = {};
    let yearlyCount = {};
    
    data.forEach(d => {
        let year = d.Date.split('-')[0];
        if (!yearlySuccess[year]) {
            yearlySuccess[year] = 0;
            yearlyCount[year] = 0;
        }
        yearlySuccess[year] += d.Class;
        yearlyCount[year] += 1;
    });
    
    let years = Object.keys(yearlySuccess).sort();
    let rates = years.map(y => yearlySuccess[y] / yearlyCount[y]);
    
    let trace = {
        x: years,
        y: rates,
        type: 'scatter',
        mode: 'lines+markers',
        line: { color: '#ff3b30', width: 3 },
        marker: { size: 8 }
    };
    
    let layout = {
        title: {
            text: 'Launch Success Yearly Trend',
            font: { color: '#f5f5f7', size: 16 }
        },
        paper_bgcolor: 'rgba(0,0,0,0)',
        plot_bgcolor: 'rgba(0,0,0,0)',
        xaxis: { title: 'Year', gridcolor: 'rgba(255,255,255,0.05)', tickfont: { color: '#8e8e93' }, titlefont: { color: '#f5f5f7' } },
        yaxis: { range: [0, 1.1], gridcolor: 'rgba(255,255,255,0.05)', tickfont: { color: '#8e8e93' } }
    };
    
    Plotly.newPlot('yearlyTrendChart', [trace], layout, {responsive: true});
}

function plotModelAccuracy(data) {
    let methods = data.map(d => d.method);
    let testAcc = data.map(d => d.test_acc / 100);
    let valAcc = data.map(d => d.validation_acc / 100);
    
    let trace1 = {
        x: methods,
        y: valAcc,
        name: 'Validation (CV) Accuracy',
        type: 'bar',
        marker: { color: '#8e8e93' }
    };
    
    let trace2 = {
        x: methods,
        y: testAcc,
        name: 'Test Accuracy',
        type: 'bar',
        marker: { color: '#ff3b30' }
    };
    
    let layout = {
        title: {
            text: 'Model Accuracy Comparison',
            font: { color: '#f5f5f7', size: 16 }
        },
        barmode: 'group',
        paper_bgcolor: 'rgba(0,0,0,0)',
        plot_bgcolor: 'rgba(0,0,0,0)',
        xaxis: { tickfont: { color: '#8e8e93' } },
        yaxis: { range: [0, 1.1], gridcolor: 'rgba(255,255,255,0.05)', tickfont: { color: '#8e8e93' } },
        legend: { font: { color: '#f5f5f7' } }
    };
    
    Plotly.newPlot('modelComparisonChart', [trace1, trace2], layout, {responsive: true});
}

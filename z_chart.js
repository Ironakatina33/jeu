document.addEventListener("DOMContentLoaded", function() {
    console.log("Graphique CO₂ / O₂ chargé !");

    // Données du graphique
    let time = 0;
    const labels = [];
    const dataPointsO2 = [];
    const dataPointsCO2 = [];

    // Initialisation du graphique
    const ctx = document.getElementById('co2O2Chart').getContext('2d');
    const chart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: labels,
            datasets: [
                {
                    label: 'CO₂ Stocké',
                    data: dataPointsCO2,
                    borderColor: 'green',
                    backgroundColor: 'rgba(0, 128, 0, 0.2)',
                    fill: true,
                    tension: 0.2
                },
                {
                    label: 'Oxygène produit',
                    data: dataPointsO2,
                    borderColor: 'blue',
                    backgroundColor: 'rgba(0, 0, 255, 0.2)',
                    fill: true,
                    tension: 0.2
                }
            ]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                x: { title: { display: true, text: 'Temps (s)' } },
                y: { title: { display: true, text: 'Quantité (unités)' }, min: 0 }
            }
        }
    });

    // Fonction pour mettre à jour le graphique
    function updateCharts(trees) {
        time++;
        labels.push(time + 's');

        // Simulation du CO₂ stocké et de l’oxygène produit
        let totalO2 = 0;
        let totalCO2 = 0;

        trees.forEach(tree => {
            let size = parseInt(tree.style.width); // Taille de l'arbre

            // Calcul simplifié :
            totalCO2 += size * 0.5;  // Un arbre stocke du CO₂ en fonction de sa taille
            totalO2 += size * 0.3;   // Un arbre produit de l'O₂ en fonction de sa taille
        });

        dataPointsO2.push(totalO2);
        dataPointsCO2.push(totalCO2);

        // Limite à 20 points pour éviter les surcharges
        if (labels.length > 20) {
            labels.shift();
            dataPointsO2.shift();
            dataPointsCO2.shift();
        }

        // Mise à jour du graphique
        chart.update();
    }

    // Expose `updateCharts` pour que `z_apptest.js` puisse l’utiliser
    window.updateCharts = updateCharts;

    // Mise à jour automatique chaque seconde
    setInterval(() => updateCharts(window.trees || []), 1000);
});

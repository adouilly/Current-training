document.addEventListener('DOMContentLoaded', function() {
    const rows = document.querySelectorAll('tr:not(:first-child):not(:last-child):not(:nth-child(2))');
    
    function calculateTotal(row) {
        const prix = parseFloat(row.querySelector('.prix').value) || 0;
        const quantite = parseFloat(row.querySelector('.quantite').value) || 0;
        const total = prix * quantite;
        row.querySelector('.total').textContent = total.toFixed(2) + '€';
        updateGrandTotal();
    }

    function updateGrandTotal() {
        const totals = Array.from(document.querySelectorAll('.total'))
            .map(el => parseFloat(el.textContent) || 0);
        const grandTotal = totals.reduce((sum, val) => sum + val, 0);
        document.getElementById('grand-total').textContent = grandTotal.toFixed(2) + '€';
    }

    rows.forEach(row => {
        row.querySelectorAll('input').forEach(input => {
            input.addEventListener('input', () => calculateTotal(row));
        });
    });
});
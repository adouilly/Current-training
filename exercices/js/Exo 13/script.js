document.addEventListener('mousemove', (event) => {

    console.log(event.clientX, event.clientY);
    
    
})

let isFollowing = false;
const rectangle = document.querySelector('.rectangle');

rectangle.addEventListener('click', () => {
    isFollowing = !isFollowing;
});

document.addEventListener('mousemove', (event) => {
    if (isFollowing && rectangle) {
        rectangle.style.position = 'absolute';
        rectangle.style.left = event.clientX + 'px';
        rectangle.style.top = event.clientY + 'px';
    }
});
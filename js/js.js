document.addEventListener('DOMContentLoaded', function () {
    // Get all "navbar-burger" elements
    const $navbarBurgers = Array.prototype.slice.call(document.querySelectorAll('.navbar-burger'), 0);

    // Check if there are any navbar burgers
    if ($navbarBurgers.length > 0) {

        // Add a click event on each of them
        $navbarBurgers.forEach(function ($el) {
            $el.addEventListener('click', function () {

                // Get the target from the "data-target" attribute
                const target = $el.dataset.target;
                const $target = document.getElementById(target);

                // Toggle the class on both the "navbar-burger" and the "navbar-menu"
                $el.classList.toggle('is-active');
                $target.classList.toggle('is-active');

            });
        });
    }

    document.querySelectorAll('.tabs ul li')
        .forEach(a => a.addEventListener("click", (event) => {
            const item = event.currentTarget;
            const name = item.getAttribute("data-name");
            hideAll();
            item.classList.add("is-active");
            document.querySelector("#" + name).classList.remove("is-hidden");
        }));
});

const hideAll = function () {
    document.querySelectorAll('.tabs ul li')
        .forEach(a => a.classList.remove("is-active"));
    document.querySelector('#programming').classList.add("is-hidden");
    document.querySelector('#languages').classList.add("is-hidden");
    document.querySelector('#technologies').classList.add("is-hidden");
    document.querySelector('#certifications').classList.add("is-hidden");
};

function animateCss(element, animationName) {
    const node = document.querySelector(element);
    node.classList.add('animated', animationName);

    function handleAnimationEnd() {
        node.classList.remove('animated', animationName);
        node.removeEventListener('animationend', handleAnimationEnd);
    }

    node.addEventListener('animationend', handleAnimationEnd)
}

/* =========================================================
   HANKKI FOOD
   MAIN JAVASCRIPT
========================================================= */

document.addEventListener("DOMContentLoaded", () => {


    /* =====================================================
       ELEMENTS
    ===================================================== */

    const body =
        document.body;

    const header =
        document.getElementById("header");

    const mobileMenu =
        document.getElementById("mobileMenu");

    const mobileNav =
        document.getElementById("mobileNav");

    const topButton =
        document.getElementById("topButton");

    const brand =
        document.getElementById("brand");

    const hero =
        document.getElementById("home");



    /* =====================================================
       HEADER
    ===================================================== */

    function updateHeader() {

        if (window.scrollY > 50) {

            header.classList.add("scrolled");

        } else {

            header.classList.remove("scrolled");

        }

    }

    window.addEventListener(
        "scroll",
        updateHeader
    );

    updateHeader();



    /* =====================================================
       MOBILE MENU
    ===================================================== */

    if (mobileMenu) {

        mobileMenu.addEventListener(
            "click",
            () => {

                mobileNav.classList.toggle("active");

            }
        );

    }


    document
        .querySelectorAll(".mobile-nav a")
        .forEach(link => {

            link.addEventListener(
                "click",
                () => {

                    mobileNav.classList.remove("active");

                }
            );

        });



    /* =====================================================
       TOP BUTTON
    ===================================================== */

    window.addEventListener(
        "scroll",
        () => {

            if (window.scrollY > 600) {

                topButton.classList.add("show");

            } else {

                topButton.classList.remove("show");

            }

        }
    );


    topButton.addEventListener(
        "click",
        () => {

            window.scrollTo({

                top: 0,

                behavior: "smooth"

            });

        }
    );



    /* =====================================================
       HERO → BRAND
       
       핵심:
       BRAND를 position:absolute로 HERO 위에 올려두고
       transform으로 전체 BRAND를 한 번에 이동시킨다.
    ===================================================== */

    let brandOpened = false;

    let isAnimating = false;

    let wheelLocked = false;


    function openBrand() {

        if (brandOpened || isAnimating) {
            return;
        }

        isAnimating = true;

        body.classList.add("brand-open");

        brandOpened = true;


        setTimeout(() => {

            isAnimating = false;

        }, 1100);

    }


    function closeBrand() {

        if (!brandOpened || isAnimating) {
            return;
        }

        isAnimating = true;

        body.classList.remove("brand-open");

        brandOpened = false;


        setTimeout(() => {

            isAnimating = false;

        }, 1100);

    }



    /* =====================================================
       HERO BUTTON
    ===================================================== */

    document
        .querySelectorAll("[data-slide-target]")
        .forEach(button => {

            button.addEventListener(
                "click",
                event => {

                    event.preventDefault();

                    openBrand();

                }
            );

        });



    /* =====================================================
       WHEEL CONTROL
       
       HERO에서 아래로:
       BRAND가 전체적으로 위로 올라옴

       BRAND 상태에서 위로:
       BRAND 전체가 다시 내려감
    ===================================================== */

    window.addEventListener(
        "wheel",
        event => {

            const delta =
                event.deltaY;

            const currentScroll =
                window.scrollY;

            /*
                HERO 영역에서 아래로 스크롤
            */

            if (
                !brandOpened &&
                currentScroll < 120 &&
                delta > 20
            ) {

                event.preventDefault();

                if (!wheelLocked) {

                    wheelLocked = true;

                    openBrand();

                    setTimeout(() => {

                        wheelLocked = false;

                    }, 1150);

                }

                return;
            }


            /*
                BRAND가 열려 있는 상태에서
                위로 스크롤
            */

            if (
                brandOpened &&
                delta < -20
            ) {

                event.preventDefault();

                if (!wheelLocked) {

                    wheelLocked = true;

                    closeBrand();

                    setTimeout(() => {

                        wheelLocked = false;

                    }, 1150);

                }

                return;
            }

        },
        {
            passive: false
        }
    );



    /* =====================================================
       NAVIGATION
    ===================================================== */

    document
        .querySelectorAll(
            'a[href^="#"]'
        )
        .forEach(link => {

            link.addEventListener(
                "click",
                event => {

                    const targetId =
                        link.getAttribute("href");

                    if (
                        !targetId ||
                        targetId === "#"
                    ) {
                        return;
                    }

                    /*
                        HERO → BRAND
                    */

                    if (
                        targetId === "#brand"
                    ) {

                        event.preventDefault();

                        openBrand();

                        return;

                    }


                    /*
                        일반 section
                    */

                    const target =
                        document.querySelector(
                            targetId
                        );

                    if (!target) {
                        return;
                    }

                    event.preventDefault();


                    /*
                        BRAND가 열린 상태에서
                        일반 section으로 이동
                    */

                    if (brandOpened) {

                        body.classList.remove(
                            "brand-open"
                        );

                        brandOpened = false;

                    }


                    setTimeout(() => {

                        target.scrollIntoView({
                            behavior: "smooth"
                        });

                    }, 80);

                }
            );

        });



    /* =====================================================
       AUTO SLIDER
       
       HTML에서 이미지가 추가되어도
       자동으로 무한 슬라이드처럼 보이도록
       track을 복제한다.
    ===================================================== */

    const sliderTracks =
        document.querySelectorAll(
            ".slider-track"
        );


    sliderTracks.forEach(track => {

        /*
            기존 카드 복사
        */

        const originalItems =
            Array.from(
                track.children
            );


        originalItems.forEach(item => {

            const clone =
                item.cloneNode(true);

            clone.setAttribute(
                "aria-hidden",
                "true"
            );

            track.appendChild(
                clone
            );

        });

    });



    /* =====================================================
       TOUCH / DRAG
       모바일에서 슬라이더를 직접 밀 수도 있도록
    ===================================================== */

    document
        .querySelectorAll(".auto-slider")
        .forEach(slider => {

            let startX = 0;

            let isDragging = false;


            slider.addEventListener(
                "touchstart",
                event => {

                    startX =
                        event.touches[0].clientX;

                    isDragging = true;

                },
                {
                    passive: true
                }
            );


            slider.addEventListener(
                "touchend",
                event => {

                    if (!isDragging) {
                        return;
                    }

                    const endX =
                        event.changedTouches[0].clientX;

                    const difference =
                        startX - endX;


                    if (
                        Math.abs(difference) > 40
                    ) {

                        /*
                            CSS animation이
                            계속 움직이므로
                            별도의 강제 이동은 하지 않음.
                        */

                    }

                    isDragging = false;

                },
                {
                    passive: true
                }
            );

        });



    /* =====================================================
       ESC
       모바일 메뉴 닫기
    ===================================================== */

    document.addEventListener(
        "keydown",
        event => {

            if (
                event.key === "Escape"
            ) {

                mobileNav.classList.remove(
                    "active"
                );

            }

        }
    );


    /* =====================================================
       REVIEW IMAGE LIGHTBOX
    ===================================================== */

    const reviewImages =
        document.querySelectorAll(".review-card img");

    const reviewLightbox =
        document.getElementById("reviewLightbox");

    const reviewLightboxImage =
        document.getElementById("reviewLightboxImage");

    const reviewLightboxClose =
        document.getElementById("reviewLightboxClose");


    reviewImages.forEach(image => {

        image.addEventListener("click", () => {

            reviewLightboxImage.src =
                image.src;

            reviewLightbox.classList.add("active");

            document.body.classList.add("lock-scroll");

        });

    });


    function closeReviewLightbox() {

        reviewLightbox.classList.remove("active");

        document.body.classList.remove("lock-scroll");

    }


    reviewLightboxClose.addEventListener(
        "click",
        closeReviewLightbox
    );


    reviewLightbox.addEventListener(
        "click",
        event => {

            if (
                event.target === reviewLightbox
            ) {

                closeReviewLightbox();

            }

        }
    );


    document.addEventListener(
        "keydown",
        event => {

            if (
                event.key === "Escape" &&
                reviewLightbox.classList.contains("active")
            ) {

                closeReviewLightbox();

            }

        }
    );
});


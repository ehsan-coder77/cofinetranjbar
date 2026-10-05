(function () {
    /* پیام کوتاه */
    var toast = document.getElementById('toast');
    var toastText = document.getElementById('toastText');
    var timer = null;
    function showToast(msg) {
        toastText.textContent = msg;
        toast.classList.add('show');
        clearTimeout(timer);
        timer = setTimeout(function () { toast.classList.remove('show'); }, 2100);
    }

    /* اسلایدر */
    var slider = document.getElementById('promoSlider');
    var track = document.getElementById('sliderTrack');
    var dots = document.querySelectorAll('.slider-dot');
    var slideCount = track ? track.children.length : 0;
    var currentSlide = 0, autoTimer = null, dragStartX = 0, dragDeltaX = 0, dragging = false;
    var reduceMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    function goToSlide(index) {
        currentSlide = (index + slideCount) % slideCount;
        track.style.transform = 'translate3d(' + (-currentSlide * 100) + '%,0,0)';
        Array.prototype.forEach.call(dots, function (dot, i) {
            var active = i === currentSlide;
            dot.classList.toggle('is-active', active);
            dot.setAttribute('aria-selected', String(active));
        });
    }
    function stopAuto() { if (autoTimer) { clearInterval(autoTimer); autoTimer = null; } }
    function startAuto() {
        stopAuto();
        if (reduceMotion || document.hidden) return;
        autoTimer = setInterval(function () { goToSlide(currentSlide + 1); }, 3500);
    }
    document.addEventListener('visibilitychange', function () { if (document.hidden) stopAuto(); else startAuto(); });

    if (slider && track && slideCount) {
        Array.prototype.forEach.call(dots, function (dot, i) {
            dot.addEventListener('click', function () { goToSlide(i); startAuto(); });
        });
        slider.addEventListener('pointerdown', function (e) {
            dragging = true; dragStartX = e.clientX; dragDeltaX = 0;
            slider.classList.add('is-dragging'); stopAuto();
            if (e.pointerType === 'mouse') e.preventDefault();
        });
        slider.addEventListener('pointermove', function (e) {
            if (!dragging) return;
            dragDeltaX = e.clientX - dragStartX;
        });
        function end() {
            if (!dragging) return;
            dragging = false;
            slider.classList.remove('is-dragging');
            if (Math.abs(dragDeltaX) > 45) goToSlide(currentSlide + (dragDeltaX < 0 ? 1 : -1));
            startAuto();
        }
        slider.addEventListener('pointerup', end);
        slider.addEventListener('pointercancel', end);
        slider.addEventListener('pointerleave', function (e) { if (e.pointerType === 'mouse') end(); });
        goToSlide(0);
        startAuto();
    }

    /* اشتراک‌گذاری */
    document.getElementById('shareBtn').addEventListener('click', function () {
        if (navigator.clipboard && navigator.clipboard.writeText) {
            navigator.clipboard.writeText(location.href).then(function () {
                showToast('لینک پروفایل کپی شد');
            }, function () { showToast('نشانی را از نوار مرورگر کپی کنید'); });
        } else {
            showToast('نشانی را از نوار مرورگر کپی کنید');
        }
    });


    /* باکس انتخاب کانال خبری / صفحهٔ شخصی (بدون رفتن به صفحهٔ دیگر) */
    var picker = document.getElementById('picker');
    var optChannel = document.getElementById('optChannel');
    var optPage = document.getElementById('optPage');
    var lastTile = null;
    function openPicker(el) {
        lastTile = el;
        var channel = el.getAttribute('data-channel');
        var chip = el.querySelector('.chip');
        document.getElementById('pickerTitle').textContent = el.getAttribute('data-name');
        document.getElementById('pickerChip').innerHTML = chip.innerHTML;
        document.getElementById('pickerChip').className = chip.className;
        optPage.href = el.getAttribute('data-page');
        if (channel) {
            optChannel.href = channel;
            optChannel.removeAttribute('aria-disabled');
            document.getElementById('optChannelSub').textContent = 'اطلاعیه‌ها و خدمات جدید';
        } else {
            optChannel.removeAttribute('href');
            optChannel.setAttribute('aria-disabled', 'true');
            document.getElementById('optChannelSub').textContent = 'به‌زودی';
        }
        picker.hidden = false;
        document.getElementById('pickerClose').focus();
    }
    function closePicker() { picker.hidden = true; if (lastTile) lastTile.focus(); }
    Array.prototype.forEach.call(document.querySelectorAll('.link.pick'), function (el) {
        el.addEventListener('click', function (e) { e.preventDefault(); openPicker(el); });
        el.addEventListener('keydown', function (e) {
            if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); openPicker(el); }
        });
    });
    document.getElementById('pickerClose').addEventListener('click', closePicker);
    picker.addEventListener('click', function (e) { if (e.target === picker) closePicker(); });
    document.addEventListener('keydown', function (e) { if (e.key === 'Escape' && !picker.hidden) closePicker(); });
    Array.prototype.forEach.call(picker.querySelectorAll('a'), function (a) {
        a.addEventListener('click', function () { setTimeout(closePicker, 0); });
    });

    /* اطلاع باز شدن لینک */
    Array.prototype.forEach.call(document.querySelectorAll('.link:not(.pick):not(.picker-opts .link)'), function (el) {
        el.addEventListener('click', function () {
            var label = el.querySelector('.t');
            showToast('در حال باز کردن: ' + (label ? label.textContent : 'لینک'));
        });
    });
})();
var f = a => {
		let i = document.createElement("div");
		i.className = "gallery";
		let o = a[0].parentNode,
			t = a[0];
		o.insertBefore(i, t);
		for (let e of a) i.appendChild(e)
	},
	m = a => {
		let i = a.querySelectorAll("img.gallery-image");
		for (let e of Array.from(i)) {
			let l = e.closest("p");
			if (!l || !a.contains(l) || (l.textContent.trim() == "" && l.classList.add("no-text"), !l.classList.contains("no-text"))) continue;
			let g = e.parentElement.tagName == "A",
				s = e,
				r = document.createElement("figure");
			if (r.style.setProperty("flex-grow", e.getAttribute("data-flex-grow") || "1"), r.style.setProperty("flex-basis", e.getAttribute("data-flex-basis") || "0"), g && (s = e.parentElement), s.parentElement.insertBefore(r, s), r.appendChild(s), e.hasAttribute("alt")) {
				let n = document.createElement("figcaption");
				n.innerText = e.getAttribute("alt"), r.appendChild(n)
			}
			if (!g) {
				r.className = "gallery-image";
				let n = document.createElement("a");
				n.href = e.src, n.setAttribute("target", "_blank"), n.setAttribute("data-pswp-width", e.width.toString()), n.setAttribute("data-pswp-height", e.height.toString()), e.parentNode.insertBefore(n, e), n.appendChild(e)
			}
		}
		let o = a.querySelectorAll("figure.gallery-image"),
			t = [];
		for (let e of Array.from(o)) t.length ? e.previousElementSibling === t[t.length - 1] ? t.push(e) : t.length && (f(t), t = [e]) : t = [e];
		t.length > 0 && f(t)
	};
export {
	m as
	default
};

(() => {
	var m = {
		"&": "&amp;",
		"<": "&lt;",
		">": "&gt;",
		'"': "&quot;",
		"\u2026": "&hellip;"
	};

	function T(h) {
		return m[h] || h
	}

	function g(h) {
		return h.replace(/[&<>"]/g, T)
	}

	function w(h) {
		return h.replace(/[.*+\-?^${}()|[\]\\]/g, "\\$&")
	}
	var p = class {
		data;
		form;
		input;
		list;
		resultTitle;
		resultTitleTemplate;
		constructor({
			form: t,
			input: e,
			list: r,
			resultTitle: l,
			resultTitleTemplate: n
		}) {
			this.form = t, this.input = e, this.list = r, this.resultTitle = l, this.resultTitleTemplate = n, this.handleQueryString(), this.bindQueryStringChange(), this.bindSearchForm()
		}
		static processMatches(t, e, r = !0, l = 140, n = 20) {
			e.sort((i, s) => i.start - s.start);
			let c = 0,
				a = 0,
				o = 0,
				u = [];
			for (; c < e.length;) {
				let i = e[c];
				r && i.start - n > a ? (u.push(`${g(t.substring(a,a+n))} [...] `), u.push(`${g(t.substring(i.start-n,i.start))}`), o += n * 2) : (u.push(g(t.substring(a, i.start))), o += i.start - a);
				let s = c + 1,
					d = i.end;
				for (; s < e.length && e[s].start <= d;) d = Math.max(e[s].end, d), ++s;
				if (u.push(`<mark>${g(t.substring(i.start,d))}</mark>`), o += d - i.start, c = s, a = d, r && o > l) break
			}
			if (a < t.length) {
				let i = t.length;
				r && (i = Math.min(i, a + n)), u.push(`${g(t.substring(a,i))}`), r && i != t.length && u.push(" [...]")
			}
			return u.join("")
		}
		async searchKeywords(t) {
			let e = await this.getData(),
				r = [],
				l = new RegExp(t.filter((n, c, a) => (a[c] = w(n), n.trim() !== "")).join("|"), "gi");
			for (let n of e) {
				let c = [],
					a = [],
					o = {
						...n,
						preview: "",
						matchCount: 0
					},
					u = n.content.matchAll(l);
				for (let s of Array.from(u)) a.push({
					start: s.index,
					end: s.index + s[0].length
				});
				let i = n.title.matchAll(l);
				for (let s of Array.from(i)) c.push({
					start: s.index,
					end: s.index + s[0].length
				});
				c.length > 0 && (o.title = p.processMatches(o.title, c, !1)), a.length > 0 ? o.preview = p.processMatches(o.content, a) : o.preview = g(o.content.substring(0, 140)), o.matchCount = c.length + a.length, o.matchCount > 0 && r.push(o)
			}
			return r.sort((n, c) => c.matchCount - n.matchCount)
		}
		async doSearch(t) {
			let e = performance.now(),
				r = await this.searchKeywords(t);
			this.clear();
			for (let n of r) this.list.append(p.render(n));
			let l = performance.now();
			this.resultTitle.innerText = this.generateResultTitle(r.length, ((l - e) / 1e3).toPrecision(1))
		}
		generateResultTitle(t, e) {
			return this.resultTitleTemplate.replace("#PAGES_COUNT", t).replace("#TIME_SECONDS", e)
		}
		async getData() {
			if (!this.data) {
				let t = this.form.dataset.json;
				this.data = await fetch(t).then(r => r.json());
				let e = new DOMParser;
				for (let r of this.data) r.content = e.parseFromString(r.content, "text/html").body.innerText
			}
			return this.data
		}
		bindSearchForm() {
			let t = "",
				e = r => {
					r.preventDefault();
					let l = this.input.value.trim();
					if (p.updateQueryString(l, !0), l === "") return this.clear();
					t !== l && (t = l, this.doSearch(l.split(" ")))
				};
			this.input.addEventListener("input", e), this.input.addEventListener("compositionend", e)
		}
		clear() {
			this.list.innerHTML = "", this.resultTitle.innerText = ""
		}
		bindQueryStringChange() {
			window.addEventListener("popstate", t => {
				this.handleQueryString()
			})
		}
		handleQueryString() {
			let e = new URL(window.location.toString()).searchParams.get("keyword");
			this.input.value = e, e ? this.doSearch(e.split(" ")) : this.clear()
		}
		static updateQueryString(t, e = !1) {
			let r = new URL(window.location.toString());
			t === "" ? r.searchParams.delete("keyword") : r.searchParams.set("keyword", t), e ? window.history.replaceState("", "", r.toString()) : window.history.pushState("", "", r.toString())
		}
		static render(t) {
			return createElement("article", null, createElement("a", {
				href: t.permalink
			}, createElement("div", {
				class: "article-details"
			}, createElement("h2", {
				class: "article-title",
				dangerouslySetInnerHTML: {
					__html: t.title
				}
			}), createElement("section", {
				class: "article-preview",
				dangerouslySetInnerHTML: {
					__html: t.preview
				}
			})), t.image && createElement("div", {
				class: "article-image"
			}, createElement("img", {
				src: t.image,
				loading: "lazy"
			}))))
		}
	};
	window.addEventListener("load", () => {
		setTimeout(function() {
			let h = document.querySelector(".search-form"),
				t = h.querySelector("input"),
				e = document.querySelector(".search-result--list"),
				r = document.querySelector(".search-result--title");
			new p({
				form: h,
				input: t,
				list: e,
				resultTitle: r,
				resultTitleTemplate: window.searchResultTitleTemplate
			})
		}, 0)
	});
	var f = p;
})();

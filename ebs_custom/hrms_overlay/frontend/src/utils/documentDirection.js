import dayjs from "@/utils/dayjs"
import "dayjs/locale/ar"

const RTL_TARGETS = "ion-app, ion-page, ion-content, ion-header, ion-toolbar, ion-tab-bar, ion-modal"

export function applyDocumentDirection() {
	const lang = window.frappe?.boot?.lang || "en"
	const rtl = lang === "ar" || String(lang).startsWith("ar-")
	const dir = rtl ? "rtl" : "ltr"

	document.documentElement.lang = rtl ? "ar" : lang
	document.documentElement.dir = dir
	if (document.body) document.body.dir = dir
	dayjs.locale(rtl ? "ar" : "en")

	const mark = () => {
		document.querySelectorAll(RTL_TARGETS).forEach((el) => {
			if (el.getAttribute("dir") !== dir) el.setAttribute("dir", dir)
		})
	}

	mark()
	if (!window.__ebsDirObserver && document.body) {
		window.__ebsDirObserver = new MutationObserver(mark)
		window.__ebsDirObserver.observe(document.body, { childList: true, subtree: true })
	}
}

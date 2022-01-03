class GoogleSearch {

    constructor() {
        this.autoConfirmConsentDialog()
    }

    /**
     * Check whether the consent cookie (GDPR) exists
     * and consent was given; otherwise, auto confirm the dialog.
     */
    autoConfirmConsentDialog() {

        let count = 0

        const maxTries = 10
        const intervalInMs = 150

        let confirmConsentDialog = true
        let consentDialogSelector =
            '[role="dialog"] div:nth-child(3) span div div div + div:nth-child(3) button:nth-child(2)'


        if ((document.cookie).indexOf('CONSENT') > -1) {
            /**
             * Consent cookie found
             */
            if ((document.cookie).indexOf('YES') > -1) {
                // Consent given
                confirmConsentDialog = false
            } else if ((document.cookie).indexOf('PENDING') > -1) {
                // Consent pending
            }
        }

        if (confirmConsentDialog) {
            const interval = setInterval(() => {
                const target = document
                    .querySelector(consentDialogSelector)
                if (count === maxTries) {
                    clearInterval(interval)
                }
                if (target) {
                    target.click()
                    clearInterval(interval)
                }
                count++
            }, intervalInMs)
        }
    }
}

(() => {
    new GoogleSearch()
})()

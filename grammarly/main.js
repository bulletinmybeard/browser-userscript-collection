class Grammarly {

    lastURL = location.href

    constructor() {
        new MutationObserver(() => {
            const url = location.href
            if (url !== this.lastURL) {
                this.lastURL = url
                if (new RegExp('\\/ddocs\\/[0-9]+$').test(this.lastURL)) {
                    this.documentEditPage()
                } else if (!new RegExp('\\/apps$').test(this.lastURL)) {
                    this.documentListingPage()
                }
            }
        })
            .observe(document, {
                childList: true,
                subtree: true,
            })

        if (new RegExp('\\/ddocs\\/[0-9]+$').test(this.lastURL)) {
            this.documentEditPage()
        } else if (!new RegExp('\\/apps$').test(this.lastURL)) {
            this.documentListingPage()
        }
    }

    deleteDocument() {

        const params = Object
            .fromEntries(new URLSearchParams(location.search).entries())

        if (params.hasOwnProperty('action')
            && params.hasOwnProperty('docId')) {

            let count = 0

            const maxTries = 4
            const timeoutInMs = 500
            const selectorQuery = `[data-name-id="${params.docId}"]`

            const interval = setInterval(() => {
                const documentLink = document.querySelector(selectorQuery)
                if (count === maxTries) {
                    clearInterval(interval)
                    console.error(`Selector query '${selectorQuery}' failed (Element not found)`)
                    return
                }
                if (documentLink) {
                    clearInterval(interval)

                    const deleteButton = document.querySelector('[data-name="doc-delete-btn"]')
                    if (deleteButton) {
                        deleteButton.style.backgroundColor = 'red'
                        deleteButton.click()
                        window.history.pushState({}, document.title, window.location.pathname)
                    }
                }
                count++
            }, timeoutInMs)
        }
    }

    /**
     * Everything related to the document edit page.
     * @return {undefined}
     */
    documentEditPage() {
        /**
         * Get the document ID from the URL.
         */
        const documentId = (window.location.pathname).split('/').at(-1)

        const deleteBtnElement = document.createElement('a')
        deleteBtnElement.appendChild(document.createTextNode('[click to delete me]'))
        deleteBtnElement.title = '[click to delete me]'
        deleteBtnElement.href = `/?docId=${documentId}&action=delete`

        this.applyInlineStyles(deleteBtnElement, {
            display: 'block',
            'z-index': 99999,
            background: 'red',
            position: 'absolute',
            top: '4rem',
            left: '1rem',
            padding: '1rem'
        })

        // ...
        document.body.appendChild(deleteBtnElement);
    }

    /**
     * Everything related to the document listing page.
     * @return {undefined}
     */
    documentListingPage() {
        this.updateListItems()
        this.deleteDocument()
    }

    /**
     * Set inline styles from object.
     * @param {HTMLElement} element
     * @param {object} styles
     * @return {undefined}
     */
    applyInlineStyles(element, styles) {
        for (const key in styles) {
            element.style[key] = styles[key]
        }
    }

    updateListItems() {

        let count = 0

        const maxTries = 10
        const timeoutInMs = 200
        const querySelectors = {
            docItemList: '[class*="document_list-documents"]',
            docItems: '[class*="document_item-itemWrapper"]',
        }
        /**
         * Wait for the document list and items to appear and apply the changes.
         * @returns {number}
         */
        const interval = setInterval(() => {
            const container = document.querySelector(querySelectors.docItemList)
            if (count === maxTries) {
                clearInterval(interval)
                console.error(`Selector query '${querySelectors.docItemList}' failed (Element not found)`)
                return
            }
            if (container) {
                clearInterval(interval)
                console.log('container found: ', container)

                const items = container.querySelectorAll(querySelectors.docItems)
                if (items && items.length > 0) {

                    /**
                     * Alter DOM elements and their behavior.
                     */
                    ([...[], ...items]).forEach(node => {
                        this.alterDocumentListinglement(node)
                    })

                    /**
                     * The MutationObserver will listen to all DOM changes in the container element.
                     * Newly added nodes will be altered in the same fashion as on website load.
                     */
                    new MutationObserver((mutations) => {
                        mutations.forEach((mutation) => {
                            mutation.addedNodes.forEach((node) => {
                                this.alterDocumentListinglement(node)
                            })
                        })
                    })
                        .observe(container, {
                            childList: true,
                            subtree: true,
                        })
                }
            }
            count++
        }, timeoutInMs)
    }

    alterDocumentListinglement(node) {
        const previewElement = node.querySelector('[data-name="doc-first-content"]')
        if (previewElement) {
            node.setAttribute('title', previewElement.innerText)
        }

        const linkElement = node.querySelector('[class*="document_item-item"]')
        if (linkElement) {
            /**
             * Listen to and block click events,
             * query the document URL, and open the URL in a new tab.
             */
            linkElement.addEventListener('click', () => {
                const url = linkElement.getAttribute('href')
                if (url) {
                    // event.preventDefault()
                    // window.open(url, '_blank').focus();
                }
            })
        }
    }
}

(() => {
    new Grammarly()
})()

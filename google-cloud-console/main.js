class GoogleCloudConsole {

    projectId

    BG_COLOR_RED = '#ff0000de'
    BG_COLOR_GREEN = 'green'
    BG_COLOR_BLUE = 'rgb(27, 114, 230)'
    BG_COLOR_DEFAULT = this.BG_COLOR_BLUE

    INIT_INTERVAL = 250

    QS_CONTAINER = '.cfc-platform-bar-container'
    QS_SWITCHER_BUTTON = 'span.cfc-switcher-button-label'

    PROJECT_COLOR_MAPPING = {
        '-stg': this.BG_COLOR_BLUE,
        '-dev': this.BG_COLOR_GREEN,
        '-prd': this.BG_COLOR_RED,
    }

    constructor() {
        this.toggleNavigationColor()
    }

    /**
     * Since the GCP Console is loading featues asynchronously,
     * we have to make sure that elements we need are available
     * before we proceed.
     */
    toggleNavigationColor() {
        const interval = setInterval(() => {
            const target = document.querySelector(this.QS_SWITCHER_BUTTON)
            if (target) {
                this.getProjectId()
                if (this.projectId) {
                    this.toggleHeaderBackgroundColor(this.projectId)
                    /**
                     * Listening to changes and run the toggle function again.`
                     * @type {MutationObserver}
                     */
                    new MutationObserver((mutations) => {
                        if (mutations.length) {
                            this.getProjectId()
                            this.toggleHeaderBackgroundColor(this.projectId)
                        }
                    })
                    .observe(target, { attributes: true })
                    clearInterval(interval)
                }
            }
        }, this.INIT_INTERVAL)
    }

    /**
     * Set the header background color based on the environment
     * @param {string} projectId
     * @return {void}
     */
    toggleHeaderBackgroundColor(projectId) {
        const container = document.querySelector(this.QS_CONTAINER)
        if (container) {
            container.style.backgroundColor = Object
                .entries(this.PROJECT_COLOR_MAPPING)
                .reduce((acc, [project, color]) => {
                    if (new RegExp(project).test(projectId)) {
                        acc = color
                    }
                    return acc;
                }, this.BG_COLOR_DEFAULT)
        } else {
            console.error(`toggleHeaderBackgroundColor.error: 'selector not found: ${this.QS_CONTAINER}`)
        }
    }

    /**
     * Get project from GET query param
     * @return {string|null}
     */
    getProjectId() {
        const urlSearchParams = new URLSearchParams(window.location.search);
        const params = Object
            .fromEntries(urlSearchParams.entries());

        this.projectId = ('project' in params)
            ? params.project
            : null
    }
}

(() => {
    new GoogleCloudConsole()
})()

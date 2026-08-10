try {
    const theme = localStorage.getItem("theme");
    if (theme && theme !== "tanstack-dark") {
        document.documentElement.dataset.theme = theme;
    }
} catch {
    // localStorage unavailable
}

<a href="https://outline.com">
    <img src="https://github.com/taxpayer/outliner-extension/blob/main/outline-logo.png?raw=true" alt="Outline.com logo" title="Outline.com" align="left" height="120" />
</a>

# Outliner | A Chrome Extension for Outline.com

Tired of COPYing and PASTEing URL's on the **[Outline.com](https://outline.com)** website, I created this extension

## Description

This extension basically does a copy and paste of the active tab URL into the Outline.com website. They then do their magic, remove the clutter and you get your page more readable.

Although I have sent several emails to communicate with **[Outline.com](https://outline.com)** about this extension and it has more than 22k users (`10-Aug-2021`) at the [Chrome Web Store](https://chrome.google.com/webstore/detail/outliner-a-chrome-extensi/eegpjjnajnplmkigmoglgbgpibgkkepo), they never got back. Anyway, I love their service and I created this extension to make my days easier (and I really hope it helps you too!)

## Disclaimer

**I AM NOT THE **[Outline.com](https://outline.com)** SERVICE/WEBSITE DEVELOPER! I JUST CREATED THIS TINY EXTENSION, THAT USES THEIR SERVICE, AND THAT'S ALL.**

**[Outline.com](https://outline.com)** does not support and/or told me to create and/or told me also not to create this extension in any way, I did it for fun! (And because I was tired of COPY and PASTE, to be honest)

## History
### Version 1.5.1 `[27-Aug-2021]`
- A user complained about Chrome requesting a new permission to enable version 1.5.0. I identified the "tabs" permission at the manifest was responsible for that. I also checked that the command I'm using to create a new tab doesn't need that permission. So, I removed it. Less permissions needed, more happy users! :-)

### Version 1.5 `[10-Aug-2021]`
- Hey guys, long time no see! Since 2019 too many things have happened, the world has been through some real awkward-crazy times due to this terrific Covid pandemic, but I hope you're getting on, despite all the sadness and problems.
- I removed a lot of unused code in this version, especially because **[Outline.com](https://outline.com)** has changed their service since then and now this extension only opens their website with your link or page, depending on which context item you clicked, nothing else.
- I also migrated the extension to [Manifest V3](https://developer.chrome.com/docs/extensions/mv3/intro/mv3-migration/), following Google's new recommendations, especially regarding permissions.
- And I finally moved the source code to a public repo at GitHub. You can check it at [https://github.com/taxpayer/outliner-extension](https://github.com/taxpayer/outliner-extension)

### Version 1.4.4 `[12-Jul-2019]`
- As my old grandmother used to say "The only thing that there's no way to revert is death. Everything else there's a way". So, the extension is back, breathing until the next block. :-) *Miss you grandma*.

### Not A Version, But a Message `[11-Jul-2019]`
- Since yesterday, **[Outline.com](https://outline.com)**, the real owner of the excellent service that this extension uses, has blocked access to its API except for its own site. It's like when you're a kid, you own a ball and just let the other kids you want play with it. So, for now, this extension stopped working because it depends on Outline.com to decide who can or can't use their service. If anything changes in this scenario, I'll let you know. Till there, it was good to help (and play!) with you people from 28 (!!) different countries in the world that installed this extension.

### Versions (1.4.2 && 1.4.3) `[10-Jul-2019]`
- You know when you wake up in the morning with a strange feeling that something isn't really good...? Well, today it was actually all about an alarm that warned me the extension stopped working, due to **[Outline.com](https://outline.com)**'s API change. So, there goes an update on that. I hope everything is fine now. Now I can come back to sleep again...

### Version 1.4.1 `[17-Jun-2019]`
- Just one more context menu, this one for the page, not the links. It's the same action as clicking the button in the toolbar. "If it's the same action, why did you create this?" Because I'm still studying the Chrome Extensions API, found out this (different contexts for context-menu items) and I LIKED IT. Don't blame me, it's like a child visiting a new toy store.

### Version 1.4 `[17-Jun-2019]`
- You may have asked yourself what the heck is going on when you click the toolbar button or the context-menu item because you have no visual report of what is happening... ASK YOURSELF NO MORE! Now you have a fancy, non-intrusive, beautiful badge in the toolbar button indicating that the extension is querying the Outline.com website (grey with 3 little tiny dots, aka. [ellipsis](https://en.wikipedia.org/wiki/Ellipsis) or any annoying error happened (red with a big E on it, that "E" from error, in case you missed it). To those ones who know what a Chrome Console is, yes, I'm consoling the error messages, too. 

### Version 1.3
- Corrected the context-menu creation procedure. Sometimes it wasn't showing up, and that wasn't good at all because it always makes me happy when I right-click, see the context-menu item and think "Oooh, I did that".
- Now I save the Outline-created URLs locally to use it again (if you click that link again, of course) without querying the Outline.com website one more time. You know, to make things quicker. Ah, and also to save you some bytes from your expensive Internet broadband package.

### Version 1.2: 
- Now we have a fancy context menu to open the **[Outline.com](https://outline.com)** link in a fresh new tab! You don't need to open a current page's link to turn that into an Outline link anymore! (You could already figure out that this extension tries to bring you (me?) the minimum browsing effort available, right?)

### Version 1."before 1.2":
- Let's just say I created the extension because I just remembered to create a version history on version 1.2
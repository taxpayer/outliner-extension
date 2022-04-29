<a href="https://outline.com">
    <img src="https://github.com/taxpayer/outliner-extension/blob/main/assets/outline-logo.png?raw=true" alt="Old Outline.com logo" title="Outliner" align="left" height="120" />
</a>

# Outliner | An extension for ~Outline.com~ improving your reading

Tired of distractions in the middle of the text, I created this extension that uses services that improve your reading experience on the Internet.

## Description

This extension redirects the active tab/link URL to a 3rd-party service. They then do their magic, remove the clutter and you get your page more readable.

## Disclaimer

This extension uses 3rd-party services that remove clutter from webpages. Currently it uses the services from:

- **[12ft.io](https://12ft.io)**
- **[Outline TTS](https://outlinetts.com)**
- **[Print Friendly](https://www.printfriendly.com)**

**I AM NOT THE OWNER/DEVELOPER OF ANY SERVICE/WEBSITE LISTED ABOVE! I JUST CREATED THIS TINY EXTENSION, THAT USES THEIR SERVICE, AND THAT'S ALL.**

**YES, SOMETIMES I ALSO HAVE SOME COMPLAINTS ABOUT THEIR SERVICES, AS YOU DO, BUT THEN I HAVE TO CONTACT *THEM* BECAUSE, UNFORTUNATELY, THIS EXTENSION CAN'T IMPROVE OR UPDATE OR FIX ANYTHING ON THEIR SERVICES.**

The listed services do not support and/or told me to create and/or told me also not to create this extension in any way, I did it for fun!

## History

### Version 3.1 `[29-Apr-2022]`
Let's go bullet points this time:

- Added Print Friendly reading service!
- A friend of mine, Linux user, showed me a screnshot of the dialog which didn't rendered correctly the Segoe UI font. So, as a tribute to him, I changed it to the Ubuntu font, loading it from Google Fonts.
- Fixed options saving and loading. Async stuff always plays a trick on programmers.

### Version 3.0 `[15-Apr-2022]`
Yes, a new version to celebrate a great improvement. From now on, this extension officially has:
1. A popup menu where you can...
2. Choose between reading services available (more to come)...
3. And if you want your page opened in the current tab or a new one...
4. In 4 different languages (more to come)

Outline's shutdown showed how important it is to have options. This version brings the flexibility to add (and remove) reading services as needed.
Now the users of this extension can choose between [12ft.io](https://12ft.io) and [OutlineTTS](https://outlinetts.com) to read their pages.

Do you have another service you'd like to see here? Email me!

### Version 2.0.1 `[11-Apr-2022]`
There was a typo in the extension description. Yeah, it happens... 🤦🏻‍♂️

### Version 2.0 `[10-Apr-2022]`
"The king is dead, long live the king!"

Well, after almost 5 years, the beloved service **[Outline.com](https://outline.com)** has shut down. For good. It was gone so mysteriously as it was born. During all the time, I tried to communicate with them and never got an answer. Their website and available data were minimum, and even their Twitter account was abandoned. Anyway, it was a superb service. Somewhat in February, I got the first signs it was failing. I waited a bit. They have been offline for some time in the past but then returned. Not this time. And about 2 weeks ago, their website is redirected to a different offering their domain, bids starting at $150k 👀💸

So, it made no more sense to keep this extension forwarding to their website (especially because I don't have a spare $150k with me here). So... This extension is moving to a new house. I'll start using **[12ft.io](https://12ft.io)**. It's pretty straightforward like Outline.com was. Some users suggested **[OutlineTTS.com](https://outlinetts.com)**. I'm still studying how it works and if it's worth implementing it. Some of their back-end services look pretty weird, honestly.

Anyway, this extension now hits v2.0, and I intend to implement some other backup services so that it won't depend on only one service. But I decided to keep the Outline's icon as a form of gratitude and always remember why this ever started.

Keep reading!

### Version 1.5.3 `[06-Sep-2021]`
- There was a small bug in the context menu item click the first time a page was loaded. This small update fixes that. (One bugfix a day keeps the 1-star away...)

### Version 1.5.2 `[01-Sep-2021]`
- Okay, removing the "tabs" permission wasn't enough because the toolbar action requires the current tab URL. After removing that permission, that action stopped working. But....! Another permission named "activeTab" doesn't ask the user for approval (that weird dialog that frightened some users) and enables it to grab the current opened URL: precisely what we need here! So, I'm giving it another try to solve this problem definitely. (TBH, I'll wait on users feedback on this, as it worked flawlessly in my local machine).

### Version 1.5.1 `[27-Aug-2021]`
- A user complained about Chrome requesting a new permission to enable version 1.5.0. I identified the "tabs" permission at the manifest was responsible for that. I also checked that the command I'm using to create a new tab doesn't need that permission. So, I removed it. Less required permissions, more happy users! :-)

### Version 1.5 `[10-Aug-2021]`
- Hey guys, long time no see! Since 2019 too many things have happened, the world has been through some real awkward-crazy times due to this horrific Covid pandemic, but I hope you're getting on, despite all the sadness and problems.
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

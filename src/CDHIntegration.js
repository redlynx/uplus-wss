/* eslint no-console: 0 */
const parseResponseData = (
  Context,
  type,
  OffersList,
  containerName,
  customerID,
) => {
  let maxOffers = OffersList.length;
  if (
    Context.settings.pega_marketing[type] &&
    Context.settings.pega_marketing[type].placement
  ) {
    maxOffers = Context.settings.pega_marketing[type].placement.split(',')
      .length;
    if (maxOffers > OffersList.length) {
      maxOffers = OffersList.length;
    }
  }
  let isHeroPlacementFilled = false;
  for (let i = 0; i < maxOffers; i++) {
    let imgurl = OffersList[i].ImageURL.trim();
    if (!imgurl.startsWith('http')) {
      // expect the file to be hosted on this server
      imgurl = imgurl.replace('webwb/', './img/').replace('web/', './img/');
    }
    if (imgurl === '') {
      imgurl = 'img/option-1.jpg';
    }
    if (
      !isHeroPlacementFilled &&
      OffersList[i].Placement === 'Hero' &&
      typeof Context.hero_offer === 'object'
    ) {
      isHeroPlacementFilled = true;
      const msg = type === 'homePage' ? '' : OffersList[i].ShortDescription;
      if (Context.settings.pega_marketing.replaceHomePageHeader) {
        window.mainconfig.homeHeroImg = imgurl;
        imgurl = '';
      }
      Context.hero_offer = {
        img: imgurl,
        placement: OffersList[i].Placement,
        title: OffersList[i].Label,
        message: msg,
        link: Context.hero_offer.link,
        url: OffersList[i].ClickThroughURL,
        name: OffersList[i].Name,
        treatment: OffersList[i].Treatment,
        rank: OffersList[i].Rank,
        propensity: OffersList[i].Propensity,
        priority: OffersList[i].Priority,
        reason: OffersList[i].Reason,
        interactionID: OffersList[i].InteractionID,
        identifier: OffersList[i].Identifier,
        category: OffersList[i].Category,
        group: OffersList[i].Group,
        campaignID: OffersList[i].CampaignID,
        issue: OffersList[i].Issue,
        channel: OffersList[i].Channel,
        subjectID: OffersList[i].SubjectID,
        contextName: OffersList[i].ContextName,
        container: containerName,
        customerID,
        showAIoverlay: false,
      };
    } else {
      Context.data.push({
        img: imgurl,
        placement: OffersList[i].Placement,
        title: OffersList[i].Label,
        message: OffersList[i].ShortDescription,
        link: 'learnmore',
        url: OffersList[i].ClickThroughURL,
        name: OffersList[i].Name,
        treatment: OffersList[i].Treatment,
        rank: OffersList[i].Rank,
        propensity: OffersList[i].Propensity,
        priority: OffersList[i].Priority,
        reason: OffersList[i].Reason,
        interactionID: OffersList[i].InteractionID,
        identifier: OffersList[i].Identifier,
        category: OffersList[i].Category,
        group: OffersList[i].Group,
        campaignID: OffersList[i].CampaignID,
        issue: OffersList[i].Issue,
        channel: OffersList[i].Channel,
        subjectID: OffersList[i].SubjectID,
        contextName: OffersList[i].ContextName,
        container: containerName,
        customerID,
        showAIoverlay: false,
      });
    }
  }
  Context.loading = false;
};

const captureResponse = function captureResponse(Context, item, outcome) {
  if (Context.settings.pega_marketing.apiLevel !== 'V3') return;
  if (typeof window.getNBAMServiceControl !== 'undefined') {
    const nbamServiceCtrl = window.getNBAMServiceControl(Context.settings.pega_marketing.apiLevel, false);
    nbamServiceCtrl.initialize(
      Context.settings.pega_marketing.Host,
      Context.settings.pega_marketing.Port,
    );
    nbamServiceCtrl.captureResponse(
      item.container,
      item.customerID,
      item.name, /* OfferID */
      item.issue,
      item.group,
      item.interactionID,
      outcome, /* outcome could be Clicked or Impression */
      item.channel,
      'Inbound',
      item.campaignID,
      item.rank,
      item.treatment,
      item.propensity,
      item.priority,
      item.contextName,
      false,
      (data) => {
        console.log(`send capture information for ${item.name} rank=${item.rank} outcome=${outcome} response:${data.Status}`);
      },
    );
  } else {
    const scriptLoadMkt = document.createElement('script');
    scriptLoadMkt.onload = function onloadPegaMkt() {
      captureResponse(Context, item, outcome);
    };
    scriptLoadMkt.setAttribute('src', '../js/realtimecontainerscript.js');
    document.head.appendChild(scriptLoadMkt);
  }
};
const initNBAM = function initNBAM(
  Context,
  type,
  customerID,
  previousPage,
  currentPage,
) {
  if (typeof window.getNBAMServiceControl !== 'undefined') {
    const nbamServiceCtrl = window.getNBAMServiceControl(Context.settings.pega_marketing.apiLevel, false);
    nbamServiceCtrl.initialize(
      Context.settings.pega_marketing.Host,
      Context.settings.pega_marketing.Port,
    );
    let containerName = 'TopOffers';
    if (
      Context.settings.pega_marketing[type] &&
      Context.settings.pega_marketing[type].containerName
    ) {
      containerName = Context.settings.pega_marketing[type].containerName;
    }
    let placement = 'Tile';
    if (
      Context.settings.pega_marketing[type] &&
      Context.settings.pega_marketing[type].placement
    ) {
      placement = Context.settings.pega_marketing[type].placement;
    }
    const intent = Context.intent.trim();
    nbamServiceCtrl.getOffers(
      customerID,
      Context.settings.pega_marketing.contextName,
      containerName,
      '',
      Context.settings.pega_marketing.channel,
      previousPage,
      currentPage,
      (data) => {
        data.RankedResults = data.ContainerList[0].RankedResults;
        if (data.OffersList && data.OffersList.length > 0) {
          parseResponseData(
            Context,
            type,
            data.OffersList,
            containerName,
            customerID,
          );
        } else if (data.RankedResults && data.RankedResults.length > 0) {
          parseResponseData(
            Context,
            type,
            data.RankedResults,
            containerName,
            customerID,
          );
        }
      },
      intent,
      placement,
    );
  } else {
    const scriptLoadMkt = document.createElement('script');
    scriptLoadMkt.onload = function onloadPegaMkt() {
      initNBAM(Context, type, customerID, previousPage, currentPage);
    };
    scriptLoadMkt.setAttribute('src', '../js/realtimecontainerscript.js');
    document.head.appendChild(scriptLoadMkt);
  }
};

const sendRTSEvent = function sendRTSEvent(Context, item) {
  if (typeof window.getNBAMServiceControl !== 'undefined') {
    const nbamServiceCtrl = window.getNBAMServiceControl(Context.settings.pega_marketing.apiLevel, false);
    nbamServiceCtrl.initialize(
      Context.settings.pega_marketing.Host,
      Context.settings.pega_marketing.Port,
    );
    let custID = item.customerID;
    /* Read the cookie MKTID if present and send it as Customer ID instead */
    if (custID === '' && document.cookie.split('MKTID=') > 1) {
      custID = document.cookie.split('MKTID=')[1].split(';')[0];
    }
    nbamServiceCtrl.sendRTSEvent(custID, item, null);
  }
};

export {
  initNBAM,
  sendRTSEvent,
  captureResponse,
};

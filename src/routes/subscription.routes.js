router.use(verifyJWT); // Pehle login verify karo

router.route("/c/:channel_id")
    .get(getUserChannelSubscribers)
    .post(toggleSubscription);

router.route("/u/:subscriber_id").get(getSubscribedChannels);
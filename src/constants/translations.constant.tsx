export const translations = {
  /* -------------------------------------------------------------------------- */
  /*                                   English                                  */
  /* -------------------------------------------------------------------------- */

  en: {
    currencies: {
      EUR: "EUR",
      USD: "USD",
      GBP: "GBP",
      CHF: "CHF",
      CAD: "CAD",
      AUD: "AUD",
      CNY: "CNY",
      JPY: "JPY",
      INR: "INR",
    },
    metals: {
      XAU: "Gold",
      XAG: "Silver",
      XPD: "Palladium",
      XPT: "Platinum",
    },
    socialNetworks: {
      twitter: "https://twitter.com/Goldbroker_com",
      instagram: "https://www.instagram.com/goldbroker_com/",
      linkedin: "https://www.linkedin.com/company/goldbroker-com/",
      facebook: "http://www.facebook.com/212545475450672",
      youtube: "https://www.youtube.com/user/Goldbrokercom",
      telegram: "https://t.me/orfrlive",
    },
    bottomtab: {
      home: "Home",
      news: "News",
      graphics: "Charts",
      products: "Products",
      profile: "Client area",
    },
    home: {
      rate: "Live prices",
      news: "News",
      products: "Products",
      moreProducts: "More products",
      moreNews: "More news",
    },
    /* -------------------------------------------------------------------------- */
    /*                                   PROFILE                                  */
    /* -------------------------------------------------------------------------- */
    profile: {
      menu: {
        dashboard: "Dashboard",
        messages: "My messages",
        coin_and_bar: "My bars and coins",
        property_titles: "My titles of ownership",
        bills: "My invoices",
        my_transactions: "My transactions",
        bulletins: "Monthly bulletins",
        contact_us: "Contact us",
        fund_transfer: "Transfer funds",
        products: "Shop",
        my_profile: "My profile",
        password_change: "Change password",
        pin_change: "Change PIN",
        preferences: "Preferences",
        notifications: "Notifications",
        newsletter: "Newsletter",
        disconnect: "Logout",
      },
      dashboard: {
        seemore: "See more",
        bill: "My invoices",
        messages: "My messages",
        emptyMessages: "No message",
        emptyBill: "No invoice",
        emptyProducts: "No product",
        new_message: "New message",
        coin_and_bar: "My bars and coins",
        banner: {
          profile: "Verify my profile",
        },
      },
      coin_and_bar: {
        resume: {
          title: "Summary",
          purchase_value: "PURCHASE VALUE",
          current_value: "CURRENT VALUE",
          performance: "PERF",
        },
        product_detail: {
          title: "Product details",
          once: "onces",
          product: {
            warehouse: "VAULT",
            purchasePrice: "PURCHASE PRICE",
            purchaseValue: "PURCHASE VALUE",
            currentValue: "CURRENT VALUE",
            performance: "PERFORMANCE",
          },
          seemore: "Show all my products",
        },
        total: {
          title: {
            XAG: "Total silver",
            XPD: "Total palladium",
            XAU: "Total gold",
            XPT: "Total platinum",
          },
          purchaseValue: "PURCHASE VALUE",
          currentValue: "CURRENT VALUE",
          performance: "PERFORMANCE",
        },
        noproduct: "No product",
      },
      bills: {
        error: "Sorry, your payment failed. Please use another payment method or try again later.",
        pay: "Pay",
        recap: {
          screenTitle: "Secure payment",
          title: "Summary",
          useBalance: "Use my balance",
          total: "Total due",
          paymentTitle: "Payment method",
          payment: {
            card: "Bank card",
            paypal: "Paypal",
            balance: "Pay with my balance",
            transfer: "Bank transfer",
          },
        },
        done: {
          confirm_payment: "Payment confirmation",
          column1: "INVOICE",
          column2: "AMOUNT",
          title: "Thank you!",
          body: "Your payment has been successfully completed.",
          button: "Back to dashboard",
          balance: "My balance",
          total: "Total",
        },
      },
      fund_transfer: {
        currency_pick: "Select the bank transfer currency",
        bank_coor: "Bank details",
        titular: "Account holder",
        titular_address: "Holder address",
        bank_name: "Bank name",
        bank_address: "Bank address",
        account_number: "Account number",
        iban: "IBAN",
        swift: "SWIFT",
        bank_intermediary: "Intermediary bank",
        print: "Print",
        informations: {
          body11: "When entering the bank transfer, please enter your ID Client ",
          body12: "as transaction reference.",
          body2: "For transfers in euros from a European Union country, we recommend that you make a SEPA transfer (no bank fees).",
          body3: "In the case of an international SWIFT or TARGET transfer, fees will be applied by our bank.",
        },
        informations2: {
          title: "Anti-Money Laundering (AML)",
          body: "In compliance with anti-money laundering regulations, we only accept funds from the bank account previously verified in your client area.",
        },
      },
      balance: "MY BALANCE",
      messages: {
        title: "My messages",
        reception: "Inbox",
        sent: "Sent",
        empty: "No messages",
      },
      new_message: {
        title: "New message",
        object: "Subject",
        body: "Type your message here",
        attach: "Attachments",
        attach_fail: "Unable to upload attachment.",
        add_attach: "Add attachment",
        send: "Send",
      },
      success_message: {
        button: "Back to dashboard",
      },
      thread: {
        title: "Message",
        attach: "Attachments",
      },
      myProfile: {
        title: "My Profile",
        instruction: "To update your supporting documents or personal information, contact us via ",
        underlined_instruction: "secure messaging.",
        sections: {
          identity: "IDENTITY",
          address: "ADDRESS",
          bank_account: "BANK DETAILS",
        },
        documents: "Upload supporting document *",
        newAttachment: {
          title: "Add attachment",
          content: "Select the file type you wish to upload.",
          buttonDocument: "Document",
          buttonImage: "Image",
        },
        tooltip: {
          personal: {
            identity: "Copy of a valid passport (page with photo, name and signature).",
            address: "Proof of address (utility bill) dated within the last 3 months.",
            bank: "Bank identity statement (banking details).",
          },
          company: {
            identity: {
              one: "☐ Company’s director and shareholders valid passport copy (page with photo, name and signature).",
              two: "☐ Company registration certificate.",
              three: "☐ Company Memorandum & Articles of Association.",
            },
            address: "Company's registered office proof of address (rental agreement or utility bill) dated within the last 3 months.",
            bank: "Bank identity statement (banking details).",
          },
        },
        validateButton: "Validate",
      },
      passwordUpdate: {
        title: "Change password",
        firstStep: {
          instruction: "Enter your old password",
        },
        secondStep: {
          instruction: "Enter your new password",
          detail: "Your password must contain at least: 8 characters, 1 letter, 1 number.",
        },
        finalStep: {
          instruction: "Repeat your new password",
        },
        errors: {
          confirmation: "The two passwords are not identical.",
          strength: "Your password is not strong enough.",
        },
        success: {
          title: "Congratulations, ",
          body: "Your password has been successfully changed.",
          button: "Back to dashboard",
        },
      },
      pinUpdate: {
        title: "Change PIN",
        firstStep: {
          instruction: "Enter your old PIN code",
          error: "Incorrect PIN code.",
        },
        secondStep: {
          instruction: "Enter your new PIN code",
        },
        finalStep: {
          instruction: "Repeat your new PIN code",
          error: "The two PIN codes are not identical.",
        },
        success: {
          title: "Congratulations",
          body: "Your PIN code has been successfully changed.",
          button: "Back to dashboard",
        },
      },
      login: {
        become_client: {
          title: "Become a client",
          body: "Protect your wealth by holding physical gold and silver in your own name, with secure storage outside the banking system.",
        },
        pin_welcome: {
          title: "Client area",
          body: "Access the client area to view and manage your investments.",
          button: "Enter PIN",
          login_instruction: "Enter your PIN code",
          forgotten_pin: "Forgot PIN",
          error: "Incorrect PIN code.",
          alert: {
            title: "Forgotten PIN",
            body: "You will be logged out and the PIN code will be reset. Would you like to continue?",
          },
        },
        form: {
          instruction: "Access your client area",
          mail_placeholder: "Email address",
          password_placeholder: "Password",
          forgotten_password: "Forgot password",
        },
        forgotten_password_form: {
          instruction: "Reset your password",
          mail_placeholder: "Email address",
          detail: "A password reset email has been sent to you.",
          successButton: "Back to home",
          fail: "Invalid email address.",
        },
      },
    },
    leftMenu: {
      connectOrCreateAccount: {
        body: "Direct ownership of precious metals and secure storage outside the banking system.",
      },
      submenus: {
        contact: {
          title: "Contact us",
        },
        services: {
          title: "Our services",
          buyGold: "Buy gold",
          buySilver: "Buy Silver",
          secureStorage: "Secure storage",
          delivery: "Shipping",
          prices: "Rates",
          investment: "Investment process",
          resell: "Buyback",
        },
        about: {
          title: "About us",
          introduction:
            "GoldBroker.com is an investment platform founded in 2011 that facilitates holding and storing precious metals in your own name, outside the banking system and with direct access to the vaults.\n\nOur investment solution is aimed at an international clientele composed of individuals and companies.\n\nThe GoldBroker.com team is recognized for its enthusiasm, professionalism and quality of service.",
          history: {
            title: "Our history",
            content:
              'At the time of the financial crisis of 2008-2011, as difficulties accumulated in the financial and monetary system, many people were faced with the following problem: Where to invest their savings in an unstable economic and financial environment?\n\nIndividual and institutional investors had become risk-averse and were simply looking to "sleep easy" on their money, without having to worry about actively managing their assets.\n\n« I am more concerned about the return of my money than the return on my money. » — Mark Twain\n\nNoting the absence of an optimal solution to hold precious metals as a wealth insurance, Fabrice Drouin Ristori founded the company GoldBroker in 2011.\n\nGold naturally emerged as the ideal medium to meet this need for security in uncertain times. It has always played the role of insurance of a last resort in case of economic downturns, financial crashes, or major geopolitical threats. The yellow metal is a universal, rare, and unalterable asset. It is not printed like paper money and is no one\'s liability. No other financial asset can boast such high legitimacy and trustworthiness over time.\n\nGold is also a proven hedge against inflationary drifts and the loss of purchasing power induced by unbridled money creation. It retains its value over time, giving it a safe haven status. Moreover, the metal has a negative correlation with other investment categories, which makes it valuable in a diversified portfolio.\n\nBut choosing gold is not enough; you must also find the right way to hold and store it. While there are several options available to investors, they do not all provide the same guarantees.\n\nIt is possible to buy "paper" gold through ETFs, but these financial products do not guarantee the actual holding of physical gold. Investing in gold in "mutualized" form also has certain limitations, as the gold is not stored in its own name and it is impossible to access it directly to verify its existence. Finally, keeping your gold bars in a bank safe or at home does not ensure maximum protection of your assets, nor a quick and secure resale.\n\nIn order to eliminate these numerous risks inherent to investing in precious metals, which are incompatible with a logic of long-term wealth preservation, GoldBroker has based its solution on four essential pillars: physical gold (bars or coins), held in one\'s own name and without intermediaries, with secure off-bank storage in a politically stable country, and with direct access to the vault to inspect or withdraw one\'s products.\n\nIn 2012, Egon von Greyerz, founder of Matterhorn Asset Management (MAM) and a true authority in the precious metals industry, joined GoldBroker\'s Advisory Board to bring his extensive experience in wealth management.\n\nIn 2019, the Goldbroker.com platform became Or.fr in French-speaking countries only.\n\nIn September 2020, the company set up its headquarters in London, the world\'s leading hub for physical gold trading. With a qualified and experienced team of about fifteen people, GoldBroker provides its services on the French, English and German speaking markets.\n\nIn 2021, GoldBroker celebrated its tenth anniversary.\n\nToday, the company manages a stock of precious metals worth several hundred million euros.',
          },
          authors: "Authors",
          clientSection: "What our clients say about us",
          security: "We put security at the core of our business",
          invest: "Start investing in physical gold and silver with GoldBroker",
        },
        clientReview: "Client reviews",
        settings: {
          title: "Settings",
          menus: {
            notifications: {
              navigation: "Notifications",
              title: "Notifications",
              setting1: "Get an alert when a new message is received",
              setting2: "Get an alert when a new article is published",
              allowMessage: "Please allow notifications in your phone settings.",
            },
            newsletter: {
              title: "Newsletter",
              setting1: "Receive the latest precious metal markets news",
              setting2: "Receive informative or promotional messages via secure messaging",
            },
            currency: { navigation: "Currency", title: "Currency" },
            language: { navigation: "Language", title: "Language" },
          },
        },
        newsletter: {
          title: "Newsletter",
          screenTitle: "Newsletter",
          body: "Subscribe to our free newsletter to keep up with the latest precious metal markets news.",
          subscribeLater: "Subscribe later",
          success: {
            thanks: "Thank you!",
            body: "A newsletter subscription confirmation email has been sent to you.",
            backToApp: "Back to home",
          },
          fail: {
            alreadySubscribed: "This email address is already registered",
            invalidMail: "Invalid email address.",
          },
        },
        termsOfService: {
          title: "Terms & Privacy",
          content: "Lorem ipsum",
        },
      },
      socialNetworks: "Follow us on social media",
    },
    news: {
      share: "Share",
      title: "News",
      filters: {
        title: "Filter",
        validate: "Validate",
        byType: {
          title: "BY TYPE",
          categories: {
            articles: "Articles",
            videos: "Videos",
          },
        },
        bySubject: {
          title: "SUBJECT",
          categories: {
            gold: "Gold",
            investment: "Investment",
            silver: "Silver",
            currency: "Currencies",
            stock: "Markets",
            analysis: "Analysis",
            news: "News",
          },
        },
        byAuthor: {
          title: "AUTHOR",
        },
      },
      emptySearch: {
        title: "Sorry",
        body: "No results match your search criteria.",
      },
      similarVideos: "More videos",
      similarNews: "More news",
    },

    /* -------------------------------------------------------------------------- */
    /*                                   CHARTS                                   */
    /* -------------------------------------------------------------------------- */

    charts: {
      title: "Metal prices",
      all_metals_chart: {
        headers: {
          performance: "PERF",
          once: "1 OZ",
          kg: "1 KG",
        },
      },
      ratios: {
        title: "Ratios",
      },
      graphics: {
        title: "Charts",
      },
      direct: {
        title: "LIVE",
        today_prices: {
          title: {
            XAU: "Gold price today",
            XAG: "Silver price today",
            XPD: "Palladium price",
            XPT: "Platinum price today",
          },
        },
      },
      history: {
        title: "HISTORICAL",
        closing_candle_ma_chart: {
          closing: "Closing price",
          candle: "Candlestick",
          ma50: "MA50",
          ma200: "MA200",
        },
        once_price_table: {
          title: "Performance history",
          headers: {
            period: "PERIOD",
            performance: "PERFORMANCE",
          },
        },
        closing_price: {
          title: {
            XAU: "Closing price",
            XAG: "Closing price",
            XPT: "Closing price",
            XPD: "Closing price",
          },
          description: {
            XAU: "Get the closing price of gold since 2004",
            XAG: "Get the closing price of silver since 2004",
            XPT: "Get the closing price of platinum since 2004",
            XPD: "Get the closing price of palladium since 2004",
          },
          button: "Get the price",
        },
        annual_performance: {
          title: "Annual performance",
        },
      },
      scale_filter: {
        fiveDays: "5D",
        oneMonth: "1M",
        oneYear: "1Y",
        fiveYears: "5Y",
        tenYears: "10Y",
        all: "MAX",
        from: "FROM",
        to: "TO",
      },
    },

    /* -------------------------------------------------------------------------- */
    /*                                  PRODUCTS                                  */
    /* -------------------------------------------------------------------------- */

    products: {
      title: "Products",
      filters: {
        title: "Filter",
        validate: "Validate",
        byPrice: {
          title: "Price",
          categories: {
            increasing: "In ascending order",
            decreasing: "In descending order",
          },
        },
        byMetal: {
          title: "BY METAL",
          categories: {
            gold: "Gold",
            silver: "Silver",
            palladium: "Palladium",
            platinum: "Platinum",
          },
        },
        byProduct: {
          title: "PRODUCT TYPE",
          categories: {
            bar: "Bar",
            coin: "Coin",
          },
        },
        byService: {
          title: "BY SERVICE",
          categories: {
            storage: "Storage",
            delivery: "Shipping",
          },
        },
      },
      emptySearch: {
        title: "Sorry",
        body: "No products match your search criteria.",
      },
      description: {
        tabTitle: "Description",
      },
      specification: {
        tabTitle: "Specifications",
        weight: "WEIGHT",
        fineness: "FINENESS",
        brand: "BRAND",
        manufacturing_process: "MANUFACTURING PROCESS",
        length: "LENGTH (MM)",
        width: "WIDTH (MM)",
        diameter: "DIAMETER (MM)",
        thickness: "THICKNESS",
      },
      interested: {
        title: "Interested in this product?",
        subtitle: "Contact us to order",
        message: {
          subject: "Interested in a product",
          body: "Hello,\n\nI'm interested in the product ",
          body2: "\n\nPlease send me more information about the ordering process.\n\nRegards",
        },
      },
      similarProducts: "Similar products",
      ribbon: {
        new: "NEW",
      },
      details: {
        available: "Available",
        notavailable: "Unavailable",
        storage: "Secure storage",
        delivery: "Shipping",
        from_to: "From ",
      },
    },

    contactUs: {
      topbar_button_text: "Contact",
      title: "Contact us",
      tabs: {
        contactUs: "Phone or email",
        securedMessaging: "Secure messaging",
      },
      form: {
        title: "Contact form",
        inputs: {
          firstname: "Firstname *",
          lastname: "Name *",
          phone: "Phone number *",
          mail: "Email address *",
          subject: "Subject *",
          message: "Type your message here *",
        },
        country_picker_title: "Country code",
        sendButton: "Send",
        success: {
          title: "Message sent",
          body1: "Thank you, your request has been sent successfully.",
          body2: "We will get back to you as soon as possible.",
          button: "Back to home",
        },
        fail: {
          title: "Error",
          body: "An error occurred when sending the message, please try again.",
        },
      },
      securedMessaging: {
        title: "Secure Messaging",
        body: "In order for our team to respond as quickly and efficiently as possible, contact us via secure messaging.",
        accessMessagingButton: "Go to messaging",
      },
    },

    account: {
      createAccount: "Create an account",
      myProfile: "Client area",
      login: "Log in",
      subscribe: "Subscribe",
      invest: "Start investing in physical gold and silver with GoldBroker",
    },

    searchbar: "Search",

    register: {
      form: {
        instruction: "Create an account",
        company: "Company",
        mail: {
          placeholder: "Email address *",
          error: "This email address is already registered.",
        },
        password: {
          placeholder: "Password *",
          confirmPlaceholder: "Repeat password",
          rules: "Your password must contain at least: 8 characters, 1 letter, 1 number.",
        },
        legalStatus: {
          individual: "Individual",
          company: "Company",
        },
        firstname: "First name *",
        lastname: "Name *",
        cguSwitch: "I accept the ",
        termsAndConditions: "General Terms and Conditions",
        cguSwitch2: " and the ",
        privacyPolicy: "Privacy Policy",
      },
      termsofservice: {
        instruction: "General Terms and Conditions",
        button: "I've read and I agree to the GTC",
      },
      notifications: {
        instruction: "Allow notifications",
        setting1: "Get an alert when a new message is received",
        setting2: "Get an alert when a new article is published",
        allowMessage: "Please allow notifications in your phone settings.",
        skip: "Skip this step",
      },
      newsletter: {
        instruction: "Subscribe to our newsletter",
        setting1: "Receive the latest precious metal markets news",
        setting2: "Receive our special offers on gold bars and coins",
        setting3: "Receive informative or promotional messages via secure messaging",
        skip: "Skip this step",
      },
      pincode: {
        instruction: "Enter your 4 digit PIN code",
        confirmationInstruction: "Confirm your PIN code",
        detail: "This PIN code will allow you to access your client area",
        confirmationDetail: "                                                          ",
        mismatch: "The two PIN codes are not identical.",
      },
      success: {
        congratulations: "Congratulations",
        informations: "Your account has been successfully created. You now have access to the GoldBroker's client area.",
        details: "Before you can buy precious metals, you must verify your profile by providing the required supporting documents.",
        button1: "Verify my profile",
        button2: "Go to client area",
      },
    },

    review: {
      title: "Your opinion is important to us",
      body: "Because your satisfaction is important to us and we constantly strive to improve our services, we invite you to share your opinion.",
      button: "Write a review",
    },
  },

  /* -------------------------------------------------------------------------- */
  /*                                  Français                                  */
  /* -------------------------------------------------------------------------- */

  fr: {
    currencies: {
      EUR: "EUR",
      USD: "USD",
      GBP: "GBP",
      CHF: "CHF",
      CAD: "CAD",
      AUD: "AUD",
      CNY: "CNY",
      JPY: "JPY",
      INR: "INR",
    },
    metals: {
      XAU: "Or",
      XAG: "Argent",
      XPD: "Palladium",
      XPT: "Platine",
    },
    socialNetworks: {
      twitter: "https://twitter.com/Or_fr_",
      instagram: "https://www.instagram.com/or_fr_/",
      linkedin: "https://www.linkedin.com/company/goldbroker-com/",
      facebook: "http://www.facebook.com/260978307286925",
      youtube: "https://www.youtube.com/c/GoldbrokerFr",
      telegram: "https://t.me/orfrlive",
    },
    bottomtab: {
      home: "Accueil",
      news: "Actualités",
      graphics: "Cours",
      products: "Produits",
      profile: "Espace client",
    },
    home: {
      rate: "Cours",
      news: "Actualités",
      products: "Produits",
      moreProducts: "Voir plus de produits",
      moreNews: "Voir plus d'articles",
    },
    /* -------------------------------------------------------------------------- */
    /*                                   PROFILE                                  */
    /* -------------------------------------------------------------------------- */
    profile: {
      menu: {
        dashboard: "Tableau de bord",
        messages: "Mes messages",
        coin_and_bar: "Mes lingots et pièces",
        property_titles: "Mes titres de propriété",
        bills: "Mes factures",
        my_transactions: "Mes transactions",
        bulletins: "Bulletins mensuels",
        contact_us: "Nous contacter",
        fund_transfer: "Transférer des fonds",
        products: "Produits",
        my_profile: "Mon profil",
        password_change: "Modifier mon mot de passe",
        pin_change: "Modifier mon PIN",
        preferences: "Préférences",
        notifications: "Notifications",
        newsletter: "Newsletter",
        disconnect: "Déconnexion",
      },
      dashboard: {
        seemore: "Voir plus",
        bill: "Mes factures",
        messages: "Mes messages",
        emptyMessages: "Aucun message",
        emptyBill: "Aucune facture",
        emptyProducts: "Aucun produit",
        new_message: "Nouveau message",
        coin_and_bar: "Mes lingots et pièces",
        banner: {
          profile: "Vérifier mon profil",
        },
      },
      coin_and_bar: {
        resume: {
          title: "Résumé",
          purchase_value: "VALEUR À L'ACHAT",
          current_value: "VALEUR ACTUELLE",
          performance: "PERF",
        },
        product_detail: {
          title: "Détail",
          once: "onces",
          product: {
            warehouse: "COFFRE",
            purchasePrice: "PRIX D'ACHAT",
            purchaseValue: "VALEUR À L'ACHAT",
            currentValue: "VALEUR ACTUELLE",
            performance: "PERFORMANCE",
          },
          seemore: "Afficher tous mes produits",
        },
        total: {
          title: {
            XAG: "Total argent",
            XPD: "Total palladium",
            XAU: "Total or",
            XPT: "Total platine",
          },
          purchaseValue: "VALEUR À L'ACHAT",
          currentValue: "VALEUR ACTUELLE",
          performance: "PERFORMANCE",
        },
        noproduct: "Aucun produit",
      },
      bills: {
        error: "Désolé, votre paiement a échoué. Veuillez réessayer ou utiliser un autre mode de paiement.",
        pay: "Payer",
        recap: {
          screenTitle: "Paiement sécurisé",
          title: "Récapitulatif",
          useBalance: "Utiliser mon solde",
          total: "Total à payer",
          paymentTitle: "Mode de paiement",
          payment: {
            card: "Carte bancaire",
            paypal: "Paypal",
            balance: "Payer avec mon solde",
            transfer: "Virement bancaire",
          },
        },
        done: {
          confirm_payment: "Confirmation de paiement",
          column1: "FACTURE",
          column2: "MONTANT",
          title: "Merci !",
          body: "Votre paiement a été effectué avec succès.",
          button: "Retour à l'espace client",
          balance: "Mon solde",
          total: "Total",
        },
      },
      fund_transfer: {
        currency_pick: "Sélectionnez la devise du virement bancaire",
        bank_coor: "Coordonnées bancaires",
        titular: "Titulaire du compte",
        titular_address: "Adresse du titulaire",
        bank_name: "Nom de la banque",
        bank_address: "Adresse de la banque",
        account_number: "Numéro de compte",
        iban: "IBAN",
        swift: "SWIFT",
        bank_intermediary: "Banque intermédiaire",
        print: "Imprimer",
        informations: {
          body11: "Lors de la saisie du virement, veuillez indiquer votre ID Client",
          body12: "comme référence de transaction.",
          body2:
            "Pour les transferts en euros réalisés depuis un pays de l’Union Européenne, nous vous recommandons d'effectuer un virement SEPA (pas de frais bancaires).",
          body3: "Dans le cas d'un virement international SWIFT ou TARGET, des frais seront appliqués par notre banque.",
        },
        informations2: {
          title: "Lutte contre le blanchiment d’argent (AML)",
          body: "En conformité avec la réglementation en matière de lutte contre le blanchiment d'argent, nous acceptons uniquement les fonds provenant du compte bancaire préalablement vérifié dans votre espace client.",
        },
      },
      balance: "MON SOLDE",
      messages: {
        title: "Mes messages",
        reception: "Boîte de réception",
        sent: "Envoyés",
        empty: "Aucun message",
      },
      new_message: {
        title: "Nouveau message",
        object: "Objet",
        body: "Tapez votre message ici",
        attach: "Pièces jointes",
        attach_fail: "Impossible de charger la pièce jointe.",
        add_attach: "Ajouter une pièce jointe",
        send: "Envoyer",
      },
      success_message: {
        button: "Retour à l'espace client",
      },
      thread: {
        title: "Message",
        attach: "Pièces jointes",
      },
      myProfile: {
        title: "Mon profil",
        instruction: "Pour mettre à jour vos documents justificatifs ou informations personnelles, contactez-nous via la ",
        underlined_instruction: "messagerie sécurisée.",
        sections: {
          identity: "IDENTITÉ",
          address: "ADRESSE",
          bank_account: "COORDONNÉES BANCAIRES",
        },
        documents: "Télécharger un justificatif *",
        newAttachment: {
          title: "Ajouter une pièce jointe",
          content: "Sélectionnez le type de fichier que vous souhaitez télécharger.",
          buttonDocument: "Document",
          buttonImage: "Image",
        },
        tooltip: {
          personal: {
            identity:
              "Copie de la carte nationale d'identité (recto verso) ou du passeport (page avec photo, nom et signature) en cours de validité.",
            address: "Justificatif de domicile (facture eau, électricité, gaz, téléphone) datant de moins de 3 mois.",
            bank: "Relevé d'identité bancaire (RIB).",
          },
          company: {
            identity: {
              one: "☐ Copie de la carte nationale d'identité (recto verso) ou du passeport (page avec photo, nom et signature) en cours de validité des dirigeants et actionnaires de la société.",
              two: "☐ Certificat d'enregistrement de la société (KBIS, extrait BCE, extrait du Registre du commerce).",
              three: "☐ Statuts de la société",
            },
            address:
              "Justificatif d’adresse du siège social de la société (contrat de location ou facture eau, électricité, gaz, téléphone) datant de moins de 3 mois.",
            bank: "Relevé d'identité bancaire (RIB).",
          },
        },
        validateButton: "Valider",
      },
      passwordUpdate: {
        title: "Modifier le mot de passe",
        firstStep: {
          instruction: "Entrez votre ancien mot de passe",
        },
        secondStep: {
          instruction: "Entrez votre nouveau mot de passe",
          detail: "Votre mot de passe doit comporter au minimum : 8 caractères, 1 lettre, 1 chiffre.",
        },
        finalStep: {
          instruction: "Répétez votre nouveau mot de passe",
        },
        errors: {
          confirmation: "Les deux mots de passe ne sont pas identiques.",
          strength: "Votre mot de passe n'est pas assez robuste.",
        },
        success: {
          title: "Félicitations",
          body: "Votre mot de passe a été modifié avec succès.",
          button: "Retour à l'espace client",
        },
      },
      pinUpdate: {
        title: "Modifier le code PIN",
        firstStep: {
          instruction: "Entrez votre ancien code PIN",
          error: "Code PIN incorrect.",
        },
        secondStep: {
          instruction: "Entrez votre nouveau code PIN",
        },
        finalStep: {
          instruction: "Répétez votre nouveau code PIN",
          error: "Les deux codes PIN ne sont pas identiques.",
        },
        success: {
          title: "Félicitations",
          body: "Votre code PIN a été modifié avec succès.",
          button: "Retour à l'espace client",
        },
      },
      login: {
        become_client: {
          title: "Espace client",
          body: "Protégez votre patrimoine en détenant de l’or et de l’argent physique en nom propre, avec stockage sécurisé hors du système bancaire.",
        },
        pin_welcome: {
          title: "Espace client",
          body: "Accédez à l'espace client pour consulter et gérer les informations relatives à votre investissement.",
          button: "Entrer PIN",
          login_instruction: "Entrez votre code PIN",
          forgotten_pin: "Code PIN oublié",
          error: "Code PIN incorrect.",
          alert: {
            title: "Code PIN oublié",
            body: "Vous allez être déconnecté et le code PIN sera réinitialisé. Souhaitez-vous continuer ?",
          },
        },
        form: {
          instruction: "Connectez-vous à votre espace client",
          mail_placeholder: "Adresse email",
          password_placeholder: "Mot de passe",
          forgotten_password: "Mot de passe oublié",
        },
        forgotten_password_form: {
          instruction: "Réinitialisez votre mot de passe",
          mail_placeholder: "Adresse email",
          detail: "Un email de réinitialisation de mot de passe vous a été envoyé.",
          successButton: "Retour à l'accueil",
          fail: "Adresse email invalide.",
        },
      },
    },
    leftMenu: {
      connectOrCreateAccount: {
        body: "Détention en nom propre de métaux précieux et stockage sécurisé hors du système bancaire.",
      },
      submenus: {
        contact: {
          title: "Nous contacter",
        },
        services: {
          title: "Nos services",
          buyGold: "Acheter de l'or",
          buySilver: "Acheter de l'argent",
          secureStorage: "Stockage sécurisé",
          delivery: "Livraison",
          prices: "Tarifs",
          investment: "Processus d'investissement",
          resell: "Revente",
        },
        about: {
          title: "À propos",
          introduction:
            "Or.fr est une plateforme d'investissement fondée en 2011 permettant la détention et le stockage de métaux précieux en nom propre, hors du système bancaire et avec un accès direct aux coffres.\n\nNotre solution d'investissement s’adresse à une clientèle internationale composée de particuliers et de sociétés.\n\nL'équipe Or.fr est reconnue pour son enthousiasme, son professionnalisme et la qualité de ses services.",
          history: {
            title: "Notre histoire",
            content: `Au moment de la crise financière de 2008-2011, alors que les difficultés s’accumulaient dans le système financier et monétaire, de nombreuses personnes se sont trouvées confrontées à la problématique suivante : Où placer son épargne dans un contexte économique et financier instable ?\n\nDevenus peu enclins au risque, les investisseurs particuliers et institutionnels cherchaient simplement à "dormir tranquillement" sur leur argent, sans avoir à se préoccuper d'une gestion active de leur patrimoine.\n\n« Je suis plus inquiet du retour de mon argent que du retour sur investissement de mon argent. » — Mark Twain\n\nConstatant l’absence de solution optimale permettant de détenir des métaux précieux en tant qu’assurance patrimoniale, Fabrice Drouin Ristori a fondé la société GoldBroker en 2011.\n\nL’or s'est naturellement imposé comme le support idéal pour combler ce besoin de sécurité en temps incertains. Il a toujours joué le rôle d'assurance de dernier recours en cas de dégradation du scénario économique, de krachs financiers, ou de menaces géopolitiques majeures. Le métal jaune est un actif universel, rare et inaltérable. Il ne s’imprime pas comme la monnaie papier et n’est le passif d’aucune contrepartie. Aucun autre actif financier peut se prévaloir d’une légitimité et d’un capital de confiance aussi élevés dans la durée.\n\nL'or est aussi une couverture éprouvée contre les dérives inflationnistes et la perte de pouvoir d’achat induit par une création monétaire débridée. Il conserve sa valeur dans le temps, ce qui lui confère un statut de refuge. De plus, le métal affiche une corrélation négative avec les autres catégories de placement, ce qui le rend précieux au sein d'un portefeuille diversifié.\n\nMais choisir l'or ne suffit pas, encore faut-il trouver la bonne manière de le détenir et de le stocker. Si plusieurs options s’offrent aux investisseurs, elles n’apportent pas toutes les mêmes garanties.\n\nIl est possible d’acheter de l’or "papier" par le biais des ETF, mais ces produits financiers ne garantissent pas la détention réelle d'or physique. Investir dans l’or sous forme "mutualisée" comporte également certaines limites, car l'or n'est pas stocké en nom propre et il est impossible d'y accéder directement afin d'en vérifier l'existence. Enfin, conserver ses lingots dans un coffre bancaire ou à domicile ne permet pas d’assurer une protection maximale de ses avoirs, ni une revente rapide et sécurisée.\n\nAfin d’éliminer ces nombreux risques inhérents à l'investissement dans les métaux précieux,  incompatibles avec une logique de préservation du patrimoine à long terme, GoldBroker a basé sa solution sur 4 piliers essentiels : or physique (lingots ou pièces), détenu en nom propre et sans intermédiaire, avec stockage sécurisé hors banque dans un pays politiquement stable, et avec un accès direct au coffre pour inspecter ou retirer ses produits.\n\nEn 2012, Egon von Greyerz, fondateur de Matterhorn Asset Management (MAM) et véritable référence dans le secteur des métaux précieux, a rejoint le Conseil consultatif de GoldBroker afin d'apporter sa longue expérience en matière de gestion de fortune.\n\nEn 2019, la plateforme Goldbroker.com est devenue Or.fr dans les pays francophones uniquement.\n\nEn septembre 2020, la société a installé son siège à Londres, première place de négoce d'or physique au monde. Doté d'une équipe qualifiée et expérimentée d'une quinzaine de personnes, GoldBroker assure ses services sur les marchés francophones, anglophones et germanophones.\n\nEn 2021, GoldBroker a fêté ses 10 ans d'existence.\n\nLa société administre aujourd'hui un stock de métaux précieux d'une valeur de plusieurs centaines de millions d'euros.`,
          },
          authors: "Auteurs",
          clientSection: "Nos clients parlent de nous",
          security: "Nous plaçons la sécurité au coeur de notre activité",
          invest: "Commencez à investir dans l'or et l'argent physique avec Or.fr",
        },
        clientReview: "Avis clients",
        settings: {
          title: "Paramètres",
          menus: {
            notifications: {
              navigation: "Notifications",
              title: "Notifications",
              setting1: "Recevoir une alerte lorsqu'un nouveau message est reçu dans la messagerie",
              setting2: "Recevoir une alerte lorsqu'un nouvel article d'actualité est publié",
              allowMessage: "Veuillez autoriser les notifications dans les paramètres de votre téléphone.",
            },
            newsletter: {
              title: "Newsletter",
              setting1: "Recevoir les dernières actualités du marché des métaux précieux",
              setting2: "Recevoir des messages informatifs ou promotionnels via la messagerie sécurisée",
            },
            currency: { navigation: "Devise", title: "Devise" },
            language: { navigation: "Langue", title: "Langue" },
          },
        },
        newsletter: {
          title: "Newsletter",
          screenTitle: "Newsletter",
          body: "Abonnez-vous gratuitement à la newsletter pour ne rien manquer de l'actualité des métaux précieux.",
          subscribeLater: "S'abonner plus tard",
          success: {
            thanks: "Merci !",
            body: "Un email de confirmation d'abonnement à la newsletter vous a été envoyé.",
            backToApp: "Retour à l'accueil",
          },
          fail: {
            alreadySubscribed: "Cette adresse email est déjà enregistrée.",
            invalidMail: "Adresse email invalide.",
          },
        },
        termsOfService: {
          title: "CGU & confidentialité",
          content: "Lorem ipsum",
        },
      },
      socialNetworks: "Suivez-nous sur les réseaux sociaux",
    },
    news: {
      title: "Actualités",
      share: "Partager",
      filters: {
        title: "Filtrer",
        validate: "Valider",
        byType: {
          title: "PAR TYPE",
          categories: {
            articles: "Articles",
            videos: "Vidéos",
          },
        },
        bySubject: {
          title: "SUJET",
          categories: {
            gold: "Or",
            investment: "Investissement",
            silver: "Argent",
            currency: "Devises",
            stock: "Bourses",
            analysis: "Analyses",
            news: "Actualités",
          },
        },
        byAuthor: {
          title: "AUTEUR",
        },
      },
      emptySearch: {
        title: "Désolé",
        body: "Aucun résultat correspondant à vos critères de recherche n'a été trouvé.",
      },
      similarVideos: "Plus de vidéos",
      similarNews: "Plus d'articles",
    },

    /* -------------------------------------------------------------------------- */
    /*                                   CHARTS                                   */
    /* -------------------------------------------------------------------------- */

    charts: {
      title: "Cours",
      all_metals_chart: {
        headers: {
          performance: "PERF",
          once: "1 ONCE",
          kg: "1 KG",
        },
      },
      ratios: {
        title: "Ratios",
      },
      graphics: {
        title: "Graphiques",
      },
      direct: {
        title: "EN DIRECT",
        today_prices: {
          title: {
            XAU: "Prix de l'or aujourd'hui",
            XAG: "Prix de l'argent aujourd'hui",
            XPD: "Prix du palladium",
            XPT: "Prix du platine aujourd'hui",
          },
        },
      },
      history: {
        title: "HISTORIQUE",
        closing_candle_ma_chart: {
          closing: "Cours clôture",
          candle: "Chandelier",
          ma50: "MM50",
          ma200: "MM200",
        },
        once_price_table: {
          title: "Historique de performance",
          headers: {
            period: "PÉRIODE",
            performance: "PERFORMANCE",
          },
        },
        closing_price: {
          title: {
            XAU: "Cours de clôture",
            XAG: "Cours de clôture",
            XPT: "Cours de clôture",
            XPD: "Cours de clôture",
          },
          description: {
            XAU: "Obtenez le cours de clôture de l'or depuis 2004",
            XAG: "Obtenez le cours de clôture de l'argent depuis 2004",
            XPT: "Obtenez le cours de clôture du platine depuis 2004",
            XPD: "Obtenez le cours de clôture du palladium depuis 2004",
          },
          button: "Obtenir le cours",
        },
        annual_performance: {
          title: "Performance annuelle",
        },
      },
      scale_filter: {
        fiveDays: "5J",
        oneMonth: "1M",
        oneYear: "1A",
        fiveYears: "5A",
        tenYears: "10A",
        all: "MAX",
        from: "DU",
        to: "AU",
      },
    },

    /* -------------------------------------------------------------------------- */
    /*                                  PRODUCTS                                  */
    /* -------------------------------------------------------------------------- */

    products: {
      title: "Produits",
      filters: {
        title: "Filtrer",
        validate: "Valider",
        byPrice: {
          title: "Prix",
          categories: {
            increasing: "Par ordre croissant",
            decreasing: "Par ordre décroissant",
          },
        },
        byMetal: {
          title: "PAR MÉTAL",
          categories: {
            gold: "Or",
            silver: "Argent",
            palladium: "Palladium",
            platinum: "Platine",
          },
        },
        byProduct: {
          title: "TYPE DE PRODUIT",
          categories: {
            bar: "Lingot",
            coin: "Pièce",
          },
        },
        byService: {
          title: "PAR SERVICE",
          categories: {
            storage: "Stockage",
            delivery: "Livraison",
          },
        },
      },
      emptySearch: {
        title: "Désolé",
        body: "Aucun produit correspondant à vos critères de recherche n'a été trouvé.",
      },
      description: {
        tabTitle: "Description",
      },
      specification: {
        tabTitle: "Caractéristiques",
        weight: "POIDS",
        fineness: "PURETÉ",
        brand: "MARQUE",
        manufacturing_process: "MÉTHODE DE FABRICATION",
        length: "LONGUEUR (MM)",
        width: "LARGEUR (MM)",
        diameter: "DIAMÈTRE (MM)",
        thickness: "ÉPAISSEUR",
      },
      interested: {
        title: "Intéressé par ce produit ?",
        subtitle: "Contactez-nous pour commander",
        message: {
          subject: "Intéressé par un produit",
          body: "Bonjour,\n\nJe suis intéressé par le produit ",
          body2: "\n\nMerci de bien vouloir m’envoyer plus d’informations sur le processus de commande.\n\nCordialement",
        },
      },
      similarProducts: "Produits similaires",
      ribbon: {
        new: "NOUVEAU",
      },
      details: {
        available: "Disponible",
        notavailable: "Indisponible",
        storage: "Stockage sécurisé",
        delivery: "Livraison",
        from_to: "À partir de ",
      },
    },

    contactUs: {
      topbar_button_text: "Contact",
      title: "Nous contacter",
      tabs: {
        contactUs: "Téléphone ou email",
        securedMessaging: "Messagerie sécurisée",
      },
      form: {
        title: "Formulaire de contact",
        inputs: {
          firstname: "Prénom *",
          lastname: "Nom *",
          phone: "Téléphone *",
          mail: "Adresse email *",
          subject: "Sujet de votre demande *",
          message: "Tapez votre message ici *",
        },
        country_picker_title: "Indicatif téléphonique",
        sendButton: "Envoyer",
        success: {
          title: "Message envoyé",
          body1: "Merci, votre demande a été envoyée avec succès.",
          body2: "Nous y répondrons dans les plus brefs délais.",
          button: "Retour à l'accueil",
        },
        fail: {
          title: "Échec de l'envoie",
          body: "Une erreur s'est produite lors de l'envoi du message. Veuillez réessayer à nouveau.",
        },
      },
      securedMessaging: {
        title: "Messagerie sécurisée",
        body: "Afin que notre équipe vous réponde le plus rapidement et efficacement possible, contactez-nous via la messagerie sécurisée.",
        accessMessagingButton: "Accéder à la messagerie",
      },
    },

    account: {
      createAccount: "Créer un compte",
      login: "Se connecter",
      myProfile: "Mon espace client",
      subscribe: "S'abonner",
      invest: "Commencez à investir dans l'or et l'argent physique avec Or.fr",
    },

    searchbar: "Rechercher",

    register: {
      form: {
        instruction: "Créez un compte",
        company: "Société",
        mail: {
          placeholder: "Adresse email *",
          error: "L'adresse email est déjà utilisé",
        },
        password: {
          placeholder: "Mot de passe *",
          confirmPlaceholder: "Répétez le mot de passe",
          rules: "Votre mot de passe doit comporter au minimum : 8 caractères, 1 lettre, 1 chiffre.",
        },
        legalStatus: {
          individual: "Particulier",
          company: "Société",
        },
        firstname: "Prénom *",
        lastname: "Nom *",
        cguSwitch: "J'accepte les ",
        termsAndConditions: "conditions générales",
        cguSwitch2: " et la ",
        privacyPolicy: "politique de confidentialité",
      },
      termsofservice: {
        instruction: "Conditions générales de vente",
        button: "J'ai lu et j'accepte les CGV",
      },
      notifications: {
        instruction: "Activez les notifications",
        setting1: "Recevoir une alerte lorsqu'un nouveau message est reçu dans la messagerie",
        setting2: "Recevoir une alerte lorsqu'un nouvel article d'actualité est publié",
        allowMessage: "Veuillez autoriser les notifications dans les paramètres de votre téléphone.",
        skip: "Passer cette étape",
      },
      newsletter: {
        instruction: "Abonnez-vous à la newsletter",
        setting1: "Recevoir les dernières actualités du marché des métaux précieux",
        setting2: "Recevoir les offres spéciales sur les lingots et pièces",
        setting3: "Recevoir des messages informatifs ou promotionnels via la messagerie sécurisée",
        skip: "Passer cette étape",
      },
      pincode: {
        instruction: "Entrez votre code PIN à 4 chiffres",
        confirmationInstruction: "Confirmez votre code PIN",
        detail: "Ce code PIN vous permettra d'accéder à votre espace client",
        confirmationDetail: "                                                          ",
        mismatch: "Les deux codes PIN ne sont pas identiques.",
      },
      success: {
        congratulations: "Félicitations",
        informations: "Votre compte a été crée avec succès. Vous avez désormais accès à l'espace client Or.fr",
        details: "Avant de pouvoir acheter des métaux précieux, vous devez vérifier votre profil en fournissant les documents justificatifs requis.",
        button1: "Vérifier mon profil",
        button2: "Accéder à l'espace client",
      },
    },

    review: {
      title: "Votre avis nous intéresse",
      body: "Parce que votre satisfaction nous tient à cœur et que nous souhaitons sans cesse améliorer nos services, nous vous invitons à partager votre avis.",
      button: "Écrire un avis",
    },
  },

  /* -------------------------------------------------------------------------- */
  /*                                   Deutsch                                  */
  /* -------------------------------------------------------------------------- */

  de: {
    currencies: {
      EUR: "EUR",
      USD: "USD",
      GBP: "GBP",
      CHF: "CHF",
      CAD: "CAD",
      AUD: "AUD",
      CNY: "CNY",
      JPY: "JPY",
      INR: "INR",
    },
    metals: {
      XAU: "Gold",
      XAG: "Silber",
      XPD: "Palladium",
      XPT: "Platin",
    },
    socialNetworks: {
      twitter: "https://twitter.com/Goldbroker_DE",
      instagram: "https://www.instagram.com/goldbroker_com/",
      linkedin: "https://www.linkedin.com/company/goldbroker-com/",
      facebook: "https://www.facebook.com/102986164970758",
      youtube: "https://www.youtube.com/user/Goldbrokercom",
      telegram: "https://t.me/orfrlive",
    },
    bottomtab: {
      home: "Start",
      news: "News",
      graphics: "Kurse",
      products: "Produkte",
      profile: "Kundenbereich",
    },
    home: {
      rate: "Preise in Echtzeit",
      news: "News",
      products: "Produkte",
      moreProducts: "Weitere Produkte",
      moreNews: "Weitere News",
    },
    /* -------------------------------------------------------------------------- */
    /*                                   PROFILE                                  */
    /* -------------------------------------------------------------------------- */
    profile: {
      menu: {
        dashboard: "Dashboard",
        messages: "Meine Nachrichten",
        coin_and_bar: "Meine Barren und Münzen",
        property_titles: "Meine Besitzurkunden",
        bills: "Meine Rechnungen",
        my_transactions: "Meine Transaktionen",
        bulletins: "Monatliche Bulletins",
        contact_us: "Kontaktieren Sie uns",
        fund_transfer: "Überweisung tätigen",
        products: "Shop",
        my_profile: "Mein Profil",
        password_change: "Passwort ändern",
        pin_change: "PIN ändern",
        preferences: "Einstellungen",
        notifications: "Benachrichtigungen",
        newsletter: "Newsletter",
        disconnect: "Abmelden",
      },
      dashboard: {
        seemore: "Mehr anzeigen",
        bill: "Rechnungen",
        messages: "Nachrichten",
        emptyMessages: "Keine Nachricht",
        emptyBill: "Keine Rechnung",
        emptyProducts: "Kein Produkt",
        new_message: "Neue Nachricht",
        coin_and_bar: "Barren und Münzen",
        banner: {
          profile: "Mein Profil bestätigen",
        },
      },
      coin_and_bar: {
        resume: {
          title: "Übersicht",
          purchase_value: "KAUFWERT",
          current_value: "AKTUELLER WERT",
          performance: "PERF",
        },
        product_detail: {
          title: "Details",
          once: "onces",
          product: {
            warehouse: "TRESOR",
            purchasePrice: "KAUFPREIS",
            purchaseValue: "KAUFWERT",
            currentValue: "AKTUELLER WERT",
            performance: "PERFORMANCE",
          },
          seemore: "Alle Produkte anzeigen",
        },
        total: {
          title: {
            XAG: "Gesamt Silber",
            XPD: "Gesamt Palladium",
            XAU: "Gesamt Gold",
            XPT: "Gesamt Platin",
          },
          purchaseValue: "KAUFWERT",
          currentValue: "AKTUELLER WERT",
          performance: "PERFORMANCE",
        },
        noproduct: "Keine Produkte",
      },
      bills: {
        error: "Ihre Zahlung ist leider fehlgeschlagen. Bitte wählen Sie eine andere Zahlungsmethode oder versuchen Sie es später noch einmal.",
        pay: "Bezahlen",
        recap: {
          screenTitle: "Sichere Zahlung",
          title: "Übersicht",
          useBalance: "Mein Guthaben verwenden",
          total: "Gesamtbetrag",
          paymentTitle: "Zahlungsmethode",
          payment: {
            card: "Kreditkarte",
            paypal: "Paypal",
            balance: "Mit meinem Guthaben bezahlen",
            transfer: "Banküberweisung",
          },
        },
        done: {
          confirm_payment: "Zahlungsbestätigung",
          column1: "RECHNUNG",
          column2: "BETRAG",
          title: "Vielen Dank!",
          body: "Ihre Zahlung wurde erfolgreich ausgeführt.",
          button: "Zurück zum Kundenbereich",
          balance: "Mein Guthaben",
          total: "Gesamtbetrag",
        },
      },
      fund_transfer: {
        currency_pick: "Wählen Sie die Währung für die Überweisung",
        bank_coor: "Kontoangaben",
        titular: "Kontoinhaber",
        titular_address: "Adresse des Kontoinhabers",
        bank_name: "Name der Bank",
        bank_address: "Adresse der Bank",
        account_number: "Kontonummer",
        iban: "IBAN",
        swift: "SWIFT",
        bank_intermediary: "Zwischengeschaltete Bank",
        print: "Drucken",
        informations: {
          body11: "Bitte überweisen Sie den Betrag unter Angabe Ihrer Kunden-ID Client ",
          body12: "als Referenznummer.",
          body2:
            "Für Überweisungen, die in Euro und aus einem Land der Europäischen Union getätigt werden, empfehlen wir SEPA-Überweisungen (keine Bankgebühren).",
          body3: "Wenn Sie internationale Überweisungen wie SWIFT, TARGET, usw. nutzen, werden die entsprechenden Gebühren unserer Bank fällig.",
        },
        informations2: {
          title: "Anti-Geldwäsche",
          body: "In Übereinstimmung mit den Anti-Geldwäsche-Regulierungen akzeptieren wir nur Überweisungen von dem zuvor in Ihrem Kundenbereich registrierten und bestätigten Bankkonto.",
        },
      },
      balance: "MEIN GUTHABEN",
      messages: {
        title: "Meine Nachrichten",
        reception: "Posteingang",
        sent: "Gesendet",
        empty: "Keine Nachrichten",
      },
      new_message: {
        title: "Neue Nachricht",
        object: "Betreff",
        body: "Schreiben Sie hier Ihre Nachricht",
        attach: "Anhänge",
        attach_fail: "Anhang kann nicht geladen werden",
        add_attach: "Anhang hinzufügen",
        send: "Senden",
      },
      success_message: {
        button: "Zurück zum Kundenbereich",
      },
      thread: {
        title: "Nachricht",
        attach: "Anhänge",
      },
      myProfile: {
        title: "Mein Profil",
        instruction: "Um Ihre Nachweisdokumente oder persönlichen Informationen zu aktualisieren, kontaktieren Sie uns bitte über den ",
        underlined_instruction: "gesicherten Messenger.",
        sections: {
          identity: "IDENTITÄT",
          address: "ADRESSE",
          bank_account: "BANKVERBINDUNG",
        },
        documents: "Nachweisdokument hochladen *",
        newAttachment: {
          title: "Anhang hinzufügen",
          content: "Wählen Sie den Dateityp, den Sie hochladen möchten.",
          buttonDocument: "Dokument",
          buttonImage: "Bild",
        },
        tooltip: {
          personal: {
            identity: "Kopie des gültigen Reisepasses oder Personalausweises (Vorder- und Rückseite), einschließlich Foto, Name und Unterschrift.",
            address: "Wohnsitznachweis, nicht älter als 3 Monate (z. B. Strom-, Wasser-, Gas-, Telefonrechnung).",
            bank: "Nachweis über Ihre Bankverbindung.",
          },
          company: {
            identity: {
              one: "☐ Kopie der gültigen Reisepässe (Seite mit Foto, Name und Unterschrift) oder Ausweise der Direktoren und Gesellschafter.",
              two: "☐ Aktueller Auszug aus dem Handelsregister.",
              three: "☐ Gründungsurkunde & Gesellschaftervertrag.",
            },
            address: "Nachweis über die eingetragene Unternehmensanschrift (Mietvertrag oder Nebenkostenrechnung), nicht älter als 3 Monate.",
            bank: "Nachweis über die Bankverbindung des Unternehmens.",
          },
        },
        validateButton: "Bestätigen",
      },
      passwordUpdate: {
        title: "Passwort ändern",
        firstStep: {
          instruction: "Geben Sie Ihr aktuelles Passwort ein",
        },
        secondStep: {
          instruction: "Geben Sie Ihr neues Passwort ein",
          detail: "Ihr Passwort muss mindestens enthalten: 8 Zeichen, 1 Buchstaben, 1 Ziffer.",
        },
        finalStep: {
          instruction: "Wiederholen Sie Ihr neues Passwort.",
        },
        errors: {
          confirmation: "Die beiden Passwörter stimmen nicht überein.",
          strength: "Ihr Passwort ist nicht sicher genug.",
        },
        success: {
          title: "Herzlichen Glückwunsch, ",
          body: "Ihr Passwort wurde erfolgreich geändert.",
          button: "Zurück zum Kundenbereich",
        },
      },
      pinUpdate: {
        title: "PIN ändern",
        firstStep: {
          instruction: "Geben Sie Ihren aktuellen PIN ein",
          error: "PIN ungültig.",
        },
        secondStep: {
          instruction: "Geben Sie Ihren neuen PIN ein",
        },
        finalStep: {
          instruction: "Wiederholen Sie Ihren neuen PIN",
          error: "Die beiden PINs stimmen nicht überein.",
        },
        success: {
          title: "Herzlichen Glückwunsch",
          body: "Ihr PIN wurde erfolgreich geändert.",
          button: "Zurück zum Kundenbereich",
        },
      },
      login: {
        become_client: {
          title: "Kundenbereich",
          body: "Schützen Sie Ihr Vermögen durch den Besitz von physischem Gold und Silber im eigenen Namen, welches sicher außerhalb des Bankensystems gelagert wird.",
        },
        pin_welcome: {
          title: "Kundenbereich",
          body: "Melden Sie sich an, um Ihre Investitionen einzusehen und zu verwalten.",
          button: "PIN eingeben",
          login_instruction: "Geben Sie Ihren PIN ein",
          forgotten_pin: "PIN vergessen",
          error: "PIN ungültig.",
          alert: {
            title: "PIN vergessen",
            body: "Sie werden abgemeldet und der PIN wird zurückgesetzt. Möchten Sie fortfahren?",
          },
        },
        form: {
          instruction: "Im Kundenbereich anmelden",
          mail_placeholder: "E-Mail-Adresse",
          password_placeholder: "Passwort",
          forgotten_password: "Passwort vergessen",
        },
        forgotten_password_form: {
          instruction: "Passwort zurücksetzen",
          mail_placeholder: "E-Mail-Adresse",
          detail: "Eine E-Mail zum Zurücksetzen Ihres Passworts wurde an Sie gesendet.",
          fail: "Ungültige E-Mail-Adresse.",
          successButton: "Zurück zur Startseite",
        },
      },
    },
    leftMenu: {
      connectOrCreateAccount: {
        body: "Direkter Besitz von Edelmetallen und sichere Lagerung außerhalb des Bankensystems.",
      },
      submenus: {
        contact: {
          title: "Kontaktieren Sie uns",
        },
        services: {
          title: "Unsere Services",
          buyGold: "Gold kaufen",
          buySilver: "Silber kaufen",
          secureStorage: "Sichere Lagerung",
          delivery: "Lieferung",
          prices: "Tarife",
          investment: "Investitionsprozess",
          resell: "Rückkauf",
        },
        about: {
          title: "Über uns",
          introduction:
            "GoldBroker.com ist eine 2011 gegründete Investment-Plattform, die den Besitz und die Lagerung von Edelmetallen im eigenen Namen, außerhalb des Bankensystems und mit direktem persönlichem Zugang zu den Tresoren ermöglicht.\n\nUnsere Anlagelösung richtet sich an eine internationale Kundschaft, die sich aus Privatpersonen und Unternehmen zusammensetzt.\n\nDas GoldBroker.com-Team ist bekannt für seinen Enthusiasmus, seine Professionalität und die Qualität der gebotenen Dienstleistungen.",
          history: {
            title: "Unsere Geschichte",
            content:
              "Während der Finanzkrise 2008-2011, als sich die Probleme im Finanz- und Währungssystem häuften, sahen sich zahllose Menschen mit der folgenden Frage konfrontiert: Wie können Ersparnisse in diesen wirtschaftlich und finanziell instabilen Zeiten sicher angelegt werden?\n\nDie risikoscheu gewordenen Privatanleger und institutionellen Investoren wollten mit Blick auf ihre finanziellen Mittel gleichermaßen einfach nur „ruhig schlafen“ können, ohne sich um die aktive Verwaltung ihres Vermögens sorgen zu müssen.\n\n„Ich mache mir mehr Sorgen darum, mein Geld überhaupt zurückzuerhalten, als eine Rendite darauf zu erhalten.“ — ​Mark Twain\n\nAus Mangel an einer optimalen Lösung für den Besitz von Edelmetallen als Absicherung des eigenen Vermögens entschied sich Fabrice Drouin Ristori 2011 das Unternehmen GoldBroker zu gründen.\n\nGold hat sich als ideales Mittel erwiesen, um die erhöhten Sicherheitsbedürfnisse in ungewissen Zeiten zu befriedigen. Es hat schon immer eine wichtige Rolle als letzte Absicherung im Fall einer schlechten Wirtschaftsentwicklung und bei Finanzcrashs oder schwerwiegenden geopolitischen Bedrohungen gespielt. Das gelbe Metall ist ein universeller, seltener und unveränderlicher Vermögenswert. Es kann nicht gedruckt werden wie Papiergeld und stellt nicht die Verbindlichkeit einer Gegenpartei dar. Keine andere Finanzanlage kann eine vergleichbare Legitimität und langfristig ein so hohes Vertrauenskapital vorweisen.\n\nGold ist darüber hinaus ein erprobter Schutz vor inflationären Tendenzen und einem Verlust der Kaufkraft infolge überbordender Geldschöpfung. Das Metall bewahrt seinen Wert langfristig, was ihm den Status eines sicheren Hafens verleiht. Es weist zudem eine negative Korrelation zu anderen Anlageklassen auf und wird dadurch zur kostbaren Ergänzung für jedes breit aufgestellte Portfolio.\n\nEs reicht jedoch nicht, sich für eine Investition in Gold zu entscheiden, auch die richtige Form des Besitzes und der Lagerung ist von grundlegender Bedeutung. Dem Anleger bieten sich mehrere Optionen, die jedoch nicht die gleiche Sicherheit garantieren.\n\nMan kann „Papiergold“ in Form von ETFs erwerben, doch bei diesem Finanzprodukt ist der Besitz von physischem Gold nicht garantiert. Eine Investition in „sammelverwahrtes“ Gold ist ebenfalls mit gewissen Einschränkungen verbunden, da dieses Gold nicht in Ihrem eigenen Namen gelagert wird und ein direkter Zugang zur Prüfung seiner Existenz nicht möglich ist. Die Aufbewahrung von Goldbarren im Bankschließfach oder in den eigenen vier Wänden birgt dagegen gewisse Sicherheitsrisiken und ermöglicht keinen schnellen und sicheren Wiederverkauf.\n\nUm diese verschiedenen Risiken im Zusammenhang mit Edelmetallinvestitionen auszuschließen, die mit einer langfristigen Strategie zur Vermögenssicherung inkompatibel sind, stützt sich die Lösung von GoldBroker auf vier Grundpfeiler: physisches Gold (Münzen oder Barren), Besitz im eigenen Namen ohne Zwischenhändler, sichere Lagerung außerhalb des Bankensystems in einem politisch stabilen Land und direkter Zugang zum Tresor zur Inspektion oder Entnahme der Produkte.\n\n2012 wird Egon von Greyerz, der Gründer von Matterhorn Asset Management (MAM) und eine echte Koryphäe des Edelmetallsektors, Berater von GoldBroker, um seine langjährige Erfahrung im Bereich der Vermögensverwaltung einzubringen.\n\n2019 wird die Plattform GoldBroker.com in den französischsprachigen Ländern in Or.fr umbenannt.\n\nIm September 2020 richtet das Unternehmen seinen neuen Sitz in London ein, dem größten Handelsplatz für physische Edelmetalle weltweit. Dank seines qualifizierten und erfahrenen Teams von rund 15 Mitarbeitern kann GoldBroker.com seine Dienste auf dem französisch-, englisch- und deutschsprachigen Markt anbieten.\n\n2021 feiert GoldBroker das 10-jährige Bestehen des Unternehmens.\n\nHeute verwaltet das Unternehmen Edelmetallbestände im Wert von mehreren hundert Millionen Euro.",
          },
          authors: "Autoren",
          clientSection: "Kundenmeinungen",
          security: "Ihre Sicherheit steht für uns an erster Stelle",
          invest: "Beginnen Sie mit GoldBroker in physisches Gold und Silber zu investieren",
        },
        clientReview: "Kundenmeinungen",
        settings: {
          title: "Einstellungen",
          menus: {
            notifications: {
              navigation: "Benachrichtigungen",
              title: "Benachrichtigungen",
              setting1: "Benachrichtigt werden, wenn Sie eine neue Nachricht empfangen",
              setting2: "Benachrichtigt werden, wenn ein neuer Artikel veröffentlich wird",
              allowMessage: "Bitte lassen Sie in den Einstellungen Ihres Telefons Benachrichtigungen zu.",
            },
            newsletter: {
              title: "Newsletter",
              setting1: "Erhalten Sie aktuelle News von den Edelmetallmärkten",
              setting2: "Informative und kommerzielle Mitteilungen über den sicheren Messenger erhalten",
            },
            currency: { navigation: "Währung", title: "Währung" },
            language: { navigation: "Sprache", title: "Sprache" },
          },
        },
        newsletter: {
          title: "Newsletter",
          screenTitle: "Newsletter",
          body: "Abonnieren Sie unseren kostenlosen Newsletter und lesen Sie wöchentlich, was die Edelmetallmärkte aktuell bewegt.",
          subscribeLater: "Später abonnieren",
          success: {
            thanks: "Vielen Dank!",
            body: "Zur Bestätigung Ihres Abonnements haben wir Ihnen eine E-Mail gesendet.",
            backToApp: "Zurück zum Start",
          },
          fail: {
            alreadySubscribed: "Diese E-Mail-Adresse ist bereits registriert",
            invalidMail: "E-Mail-Adresse ungültig",
          },
        },
        termsOfService: {
          title: "AGB & Datenschutz",
          content: "Lorem ipsum",
        },
      },
      socialNetworks: "Folgen Sie uns in den sozialen Medien",
    },
    news: {
      share: "Teilen",
      title: "News",
      filters: {
        title: "Filtern",
        validate: "Bestätigen",
        byType: {
          title: "ART",
          categories: {
            articles: "Artikel",
            videos: "Videos",
          },
        },
        bySubject: {
          title: "THEMA",
          categories: {
            gold: "Gold",
            investment: "Investition",
            silver: "Silber",
            currency: "Währungen",
            stock: "Märkte",
            analysis: "Analyse",
            news: "News",
          },
        },
        byAuthor: {
          title: "AUTOR",
        },
      },
      emptySearch: {
        title: "Tut uns leid",
        body: "Für Ihre Suchkriterien gibt es keine Ergebnisse.",
      },
      similarVideos: "Weitere Videos",
      similarNews: "Weitere Artikel",
    },

    /* -------------------------------------------------------------------------- */
    /*                                   CHARTS                                   */
    /* -------------------------------------------------------------------------- */

    charts: {
      title: "Kurse",
      all_metals_chart: {
        headers: {
          performance: "PERF",
          once: "1 UNZE",
          kg: "1 KG",
        },
      },
      ratios: {
        title: "Verhältnisse",
      },
      graphics: {
        title: "Charts",
      },
      direct: {
        title: "LIVE",
        today_prices: {
          title: {
            XAU: "Goldpreis heute",
            XAG: "Silberpreis heute",
            XPD: "Palladiumpreis heute",
            XPT: "Platinpreis heute",
          },
        },
      },
      history: {
        title: "HISTORISCH",
        closing_candle_ma_chart: {
          closing: "Schlusskurs",
          candle: "Candlestick",
          ma50: "MA50",
          ma200: "MA200",
        },
        once_price_table: {
          title: "Historische Performance",
          headers: {
            period: "ZEITRAUM",
            performance: "PERFORMANCE",
          },
        },
        closing_price: {
          title: {
            XAU: "Schlusskurse",
            XAG: "Schlusskurse",
            XPT: "Schlusskurse",
            XPD: "Schlusskurse",
          },
          description: {
            XAU: "Erhalten Sie die Schlusskurse von Gold ab 2004",
            XAG: "Erhalten Sie die Schlusskurse von Silber ab 2004",
            XPT: "Erhalten Sie die Schlusskurse von Platin ab 2004",
            XPD: "Erhalten Sie die Schlusskurse von Palladium ab 2004",
          },
          button: "Preis anzeigen",
        },
        annual_performance: {
          title: "Jährliche Performance",
        },
      },
      scale_filter: {
        fiveDays: "5T",
        oneMonth: "1M",
        oneYear: "1J",
        fiveYears: "5J",
        tenYears: "10J",
        all: "MAX",
        from: "VON",
        to: "BIS",
      },
    },

    /* -------------------------------------------------------------------------- */
    /*                                  PRODUCTS                                  */
    /* -------------------------------------------------------------------------- */

    products: {
      title: "Produkte",
      filters: {
        title: "Filtern",
        validate: "Bestätigen",
        byPrice: {
          title: "Preis",
          categories: {
            increasing: "Aufsteigend",
            decreasing: "Absteigend",
          },
        },
        byMetal: {
          title: "METALL",
          categories: {
            gold: "Gold",
            silver: "Silber",
            palladium: "Palladium",
            platinum: "Platin",
          },
        },
        byProduct: {
          title: "PRODUKTART",
          categories: {
            bar: "Barren",
            coin: "Münzen",
          },
        },
        byService: {
          title: "SERVICE",
          categories: {
            storage: "Lagerung",
            delivery: "Lieferung",
          },
        },
      },
      emptySearch: {
        title: "Tut uns leid",
        body: "Für Ihre Suchkriterien gibt es keine Ergebnisse.",
      },
      description: {
        tabTitle: "Beschreibung",
      },
      specification: {
        tabTitle: "Details",
        weight: "FEINGEWICHT",
        fineness: "FEINGEHALT",
        brand: "HERSTELLER",
        manufacturing_process: "HERSTELLUNGSPROZESS",
        length: "LÄNGE (MM)",
        width: "BREITE (MM)",
        diameter: "DURCHMESSER (MM)",
        thickness: "HÖHE",
      },
      interested: {
        title: "Sie sind an diesem Produkt interessiert?",
        subtitle: "Kontaktieren Sie uns, um zu bestellen",
        message: {
          subject: "Interesse an einem Produkt",
          body: "Guten Tag,\n\nIch interessiere mich für das Produkt ",
          body2: "\n\nBitte senden Sie mir weitere Informationen zum Bestellprozess.\n\nFreundliche Grüße",
        },
      },
      similarProducts: "Ähnliche Produkte",
      ribbon: {
        new: "NEU",
      },
      details: {
        available: "Verfügbar",
        notavailable: "Nicht verfügbar",
        storage: "Sichere Lagerung",
        delivery: "Lieferung",
        from_to: "Ab ",
      },
    },

    contactUs: {
      topbar_button_text: "Kontakt",
      title: "Kontaktieren Sie uns",
      tabs: {
        contactUs: "Telefon oder E-Mail",
        securedMessaging: "Messenger",
      },
      form: {
        title: "Kontaktformular",
        inputs: {
          firstname: "Vorname *",
          lastname: "Nachname *",
          phone: "Telefonnummer *",
          mail: "E-Mail-Adresse *",
          subject: "Betreff *",
          message: "Geben Sie hier Ihre Nachricht ein *",
        },
        country_picker_title: "Landesvorwahl",
        sendButton: "Senden",
        success: {
          title: "Nachricht gesendet",
          body1: "Vielen Dank, Ihre Anfrage wurde erfolgreich gesendet.",
          body2: "Wir werden Ihnen so schnell wie möglich antworten.",
          button: "Zurück zum Start",
        },
        fail: {
          title: "Fehler",
          body: "Beim Senden der Nachricht ist ein Fehler aufgetreten. Bitte versuchen Sie es erneut.",
        },
      },
      securedMessaging: {
        title: "Messenger",
        body: "Kontaktieren Sie uns über die gesicherte Nachrichtenübermittlung, damit Ihnen unser Team so schnell wie möglich antworten kann.",
        accessMessagingButton: "Zum Messenger",
      },
    },

    account: {
      createAccount: "Ein Konto erstellen",
      myProfile: "Kundenbereich",
      login: "Anmelden",
      subscribe: "Registrieren",
      invest: "Beginnen Sie mit GoldBroker in physisches Gold und Silber zu investieren",
    },

    searchbar: "Suche",

    register: {
      form: {
        instruction: "Ein Kundenkonto erstellen",
        company: "Unternehmen",
        mail: {
          placeholder: "E-Mail-Adresse *",
          error: "Diese E-Mail-Adresse ist bereits registriert.",
        },
        password: {
          placeholder: "Passwort *",
          confirmPlaceholder: "Passwort bestätigen",
          rules: "Ihr Passwort muss mindestens enthalten: 8 Zeichen, 1 Buchstaben, 1 Ziffer.",
        },
        legalStatus: {
          individual: "Privatperson",
          company: "Unternehmen",
        },
        firstname: "Vorname *",
        lastname: "Nachname *",
        cguSwitch: "Ich akzeptiere die ",
        termsAndConditions: "Allgemeinen Geschäftsbestimmungen",
        cguSwitch2: " und die ",
        privacyPolicy: "Datenschutzbestimmungen",
      },
      termsofservice: {
        instruction: "Allgemeine Geschäftsbedingungen",
        button: "Ich habe die AGB gelesen und stimme ihnen zu",
      },
      notifications: {
        instruction: "Benachrichtigungen erlauben",
        setting1: "Benachrichtigt werden, wenn Sie eine neue Nachricht empfangen",
        setting2: "Benachrichtigt werden, wenn ein neuer Artikel veröffentlich wird",
        allowMessage: "Bitte lassen Sie in den Einstellungen Ihres Telefons Benachrichtigungen zu.",
        skip: "Diesen Schritt überspringen",
      },
      newsletter: {
        instruction: "Abonnieren Sie unseren Newsletter",
        setting1: "Erhalten Sie aktuelle News von den Edelmetallmärkten",
        setting2: "Erhalten Sie unsere Sonderangebote für Goldbarren und Münzen",
        setting3: "Informative und kommerzielle Mitteilungen über den sicheren Messenger erhalten",
        skip: "Diesen Schritt überspringen",
      },
      pincode: {
        instruction: "Geben Sie Ihren 4-stelligen PIN ein",
        confirmationInstruction: "Bestätigen Sie Ihren PIN",
        detail: "Mit diesem PIN erhalten Sie Zugang zu Ihrem Kundenbereich",
        confirmationDetail: "                                                          ",
        mismatch: "Die beiden PINs stimmen nicht überein",
      },
      success: {
        congratulations: "Herzlichen Glückwunsch",
        informations: "Ihr Konto wurde erfolgreich erstellt. Sie haben nun Zugang zum Kundenbereich von GoldBroker.",
        details: "Bevor Sie Edelmetalle bestellen können, bestätigen Sie bitte Ihr Profil, indem Sie die erforderlichen Dokumente hochladen.",
        button1: "Mein Profil bestätigen",
        button2: "Zum Kundenbereich",
      },
    },

    review: {
      title: "Ihre Meinung ist uns wichtig",
      body: "Da uns Ihre Zufriedenheit am Herzen liegt und wir ständig an der Verbesserung unseres Service arbeiten, laden wir Sie ein Ihre Meinung zu teilen.",
      button: "Eine Bewertung schreiben",
    },
  },
};

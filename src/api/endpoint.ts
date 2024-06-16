export const API = import.meta.env.VITE_API_BASE_URL;

export const SOCKET_URL = import.meta.env.VITE_API_BASE_SOCKET;

export const endpoints = {
  auth: {
    login: `login`,
  },
  user: {
    list: `admin/getAll`,
    all: `admin/users`,
    create: `admin/user/create`,
    delete: `admin/user/delete`,
    changeStatus: `admin/user/status`,
    detailUsers: `admin/user`,
    resetPassword: `admin/reset-password`,
    totalWallet: `admin/wallet/total-wallet-users`,
  },
  product: {
    list: `admin/products/all`,
    create: `admin/products`,
    delete: `product`,
    getDetail: `product`,
    getTotal: `product/total`,
  },
  category: {
    getAll: `admin/categories/all`,
    create: `admin/categories/create`,
    delete: `admin/categories/delete`,
    update: `admin/categories/edit`,
    getList: `categories/all`,
    getDetail: `admin/categories/get`,
  },
  productType: {
    getAll: `admin/product-type/all`,
    create: `admin/product-type/create`,
    delete: `admin/product-type/delete`,
    update: `admin/product-type/edit`,
  },

  brand: {
    getAll: `admin/brand/all`,
    getNoPage: `brand/all`,
    create: `admin/brand/create`,
    delete: `admin/brand/delete`,
    update: `admin/brand/edit`,
    detail: `admin/brand`,
  },
  size: {
    getAll: `admin/size/all`,
    create: `admin/size/create`,
    delete: `admin/size/delete`,
    update: `admin/size/edit`,
  },
  order: {
    getList: `admin/orders`,
    getDetail: `user/order`,
    total: `admin/orders/total`
  },
  keyChat: {
    get: `configLiveChat`,
    put: `admin/configLiveChat`,
  },
  logoHeader: {
    create: `admin/logo/header`,
    getDetail: `admin/logo/header`,
  },
  logoFooter: {
    create: `admin/logo/footer`,
    getDetail: `logo/footer`,
  },
  banner: {
    create: `admin/banner/create`,
    update: `admin/banner`,
    get: `admin/banners`,
    delete: `admin/banner`,
    detail: `banner`,
  },
  deposit: {
    addToUser: `user/wallet/deposit`,
    getListDeposit: `admin/wallet/deposit-requests`,
    getListDepositBy: `admin/wallet/deposit-requests/total`,
    changeStatusDeposit: `admin/wallet/deposit-money`,
    total: `admin/wallet/deposit-requests/total`,
    totalCommission: `admin/wallet/commission-requests/total`,
  },
  withdraw: {
    getListWithdraw: `admin/wallet/withdraw-requests`,
    confirm: `admin/wallet/confirm`,
    getListWithdrawBy: `admin/wallet/withdraw-requests/total`,
    changeStatusDraw: `admin/wallet/withdraw-money`,
    total: `admin/wallet/withdraw-requests/total`
  },
  wallet: {
    getAllHistoryTransaction: `admin/completed-requests`,
    createTransaction: `admin/create-transaction`,
  },
  liveChat: {
    get: `admin/livechat/token`,
  },
  chat: {
    createChat: "chat/create",
    addMessage: "chat/message",
    getUserChat: "chat/user",
    findUserInChat: "chat/search",
    getMessageUserChat: "chat",
    createMessage: `chat/createMessage`,
  },
  bank: {
    create: `admin/bank-account/create`,
    update: `admin/bank-account/update`,
    delete: `admin/bank-account/delete`
  },
  setting: {
    create: `admin/config/website`,
    update: `admin/config/website`,
    detail: `config/website`
  }
};

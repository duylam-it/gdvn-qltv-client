// routes
import { PATH_DASHBOARD } from '../../../routes/paths'
// components
import SvgIconStyle from '../../../components/SvgIconStyle'

// ----------------------------------------------------------------------

const getIcon = (name) => (
  <SvgIconStyle
    src={`/assets/icons/navbar/${name}.svg`}
    sx={{ width: 1, height: 1 }}
  />
)

const ICONS = {
  book: getIcon('ic_book'),
  borrow: getIcon('ic_borrow'),
  blog: getIcon('ic_blog'),
  cart: getIcon('ic_cart'),
  chat: getIcon('ic_chat'),
  mail: getIcon('ic_mail'),
  user: getIcon('ic_user'),
  kanban: getIcon('ic_kanban'),
  banking: getIcon('ic_banking'),
  booking: getIcon('ic_booking'),
  invoice: getIcon('ic_invoice'),
  calendar: getIcon('ic_calendar'),
  ecommerce: getIcon('ic_ecommerce'),
  analytics: getIcon('ic_analytics'),
  dashboard: getIcon('ic_dashboard'),
  menuItem: getIcon('ic_menu_item'),
}

const navConfig = [
  // GENERAL
  // ----------------------------------------------------------------------
  // {
  //   subheader: 'general',
  //   items: [
  //     { title: 'app', path: PATH_DASHBOARD.general.app, icon: ICONS.dashboard },
  //     {
  //       title: 'ecommerce',
  //       path: PATH_DASHBOARD.general.ecommerce,
  //       icon: ICONS.ecommerce,
  //     },
  //     {
  //       title: 'analytics',
  //       path: PATH_DASHBOARD.general.analytics,
  //       icon: ICONS.analytics,
  //     },
  //     {
  //       title: 'banking',
  //       path: PATH_DASHBOARD.general.banking,
  //       icon: ICONS.banking,
  //     },
  //     {
  //       title: 'booking',
  //       path: PATH_DASHBOARD.general.booking,
  //       icon: ICONS.booking,
  //     },
  //   ],
  // },

  // MANAGEMENT
  // ----------------------------------------------------------------------
  {
    subheader: 'Danh mục',
    items: [
      // User
      {
        title: 'Người dùng',
        path: PATH_DASHBOARD.borrow.root,
        icon: ICONS.user,
        children: [
          { title: 'Tất cả', path: PATH_DASHBOARD.userCustom.all },
          { title: 'Tạo mới', path: PATH_DASHBOARD.userCustom.new },
        ],
      },

      // Book
      {
        title: 'Sách',
        path: PATH_DASHBOARD.book.root,
        icon: ICONS.book,
        children: [
          { title: 'Tất cả', path: PATH_DASHBOARD.book.all },
          { title: 'Tạo mới', path: PATH_DASHBOARD.book.new },
        ],
      },

      // Borrow
      {
        title: 'Phiếu mượn',
        path: PATH_DASHBOARD.borrow.root,
        icon: ICONS.borrow,
        children: [
          { title: 'Tất cả', path: PATH_DASHBOARD.borrow.all },
          { title: 'Tạo mới', path: PATH_DASHBOARD.borrow.new },
        ],
      },

      // E-COMMERCE
      // {
      //   title: 'ecommerce',
      //   path: PATH_DASHBOARD.eCommerce.root,
      //   icon: ICONS.cart,
      //   children: [
      //     { title: 'shop', path: PATH_DASHBOARD.eCommerce.shop },
      //     { title: 'product', path: PATH_DASHBOARD.eCommerce.demoView },
      //     { title: 'list', path: PATH_DASHBOARD.eCommerce.list },
      //     { title: 'create', path: PATH_DASHBOARD.eCommerce.new },
      //     { title: 'edit', path: PATH_DASHBOARD.eCommerce.demoEdit },
      //     { title: 'checkout', path: PATH_DASHBOARD.eCommerce.checkout },
      //   ],
      // },

      // // INVOICE
      // {
      //   title: 'invoice',
      //   path: PATH_DASHBOARD.invoice.root,
      //   icon: ICONS.invoice,
      //   children: [
      //     { title: 'list', path: PATH_DASHBOARD.invoice.list },
      //     { title: 'details', path: PATH_DASHBOARD.invoice.demoView },
      //     { title: 'create', path: PATH_DASHBOARD.invoice.new },
      //     { title: 'edit', path: PATH_DASHBOARD.invoice.demoEdit },
      //   ],
      // },

      // // BLOG
      // {
      //   title: 'blog',
      //   path: PATH_DASHBOARD.blog.root,
      //   icon: ICONS.blog,
      //   children: [
      //     { title: 'posts', path: PATH_DASHBOARD.blog.posts },
      //     { title: 'post', path: PATH_DASHBOARD.blog.demoView },
      //     { title: 'create', path: PATH_DASHBOARD.blog.new },
      //   ],
      // },
    ],
  },

  // APP
  // ----------------------------------------------------------------------
  // {
  //   subheader: 'app',
  //   items: [
  //     {
  //       title: 'mail',
  //       path: PATH_DASHBOARD.mail.root,
  //       icon: ICONS.mail,
  //       info: <Label color="error">+32</Label>,
  //     },
  //     { title: 'chat', path: PATH_DASHBOARD.chat.root, icon: ICONS.chat },
  //     {
  //       title: 'calendar',
  //       path: PATH_DASHBOARD.calendar,
  //       icon: ICONS.calendar,
  //     },
  //     { title: 'kanban', path: PATH_DASHBOARD.kanban, icon: ICONS.kanban },
  //   ],
  // },

  // DEMO MENU STATES
  // {
  //   subheader: 'Other cases',
  //   items: [
  //     {
  //       // default roles : All roles can see this entry.
  //       // roles: ['user'] Only users can see this item.
  //       // roles: ['admin'] Only admin can see this item.
  //       // roles: ['admin', 'manager'] Only admin/manager can see this item.
  //       // Reference from 'src/guards/RoleBasedGuard'.
  //       title: 'item_by_roles',
  //       path: PATH_DASHBOARD.permissionDenied,
  //       icon: ICONS.menuItem,
  //       roles: ['admin'],
  //       caption: 'only_admin_can_see_this_item',
  //     },
  //     {
  //       title: 'menu_level_1',
  //       path: '#1',
  //       icon: ICONS.menuItem,
  //       children: [
  //         { title: 'menu_level_2', path: '#2', disabled: true },
  //         {
  //           title: 'menu_level_2',
  //           path: '#3',
  //           children: [
  //             { title: 'menu_level_3', path: '#4' },
  //             { title: 'menu_level_3', path: '#5' },
  //           ],
  //         },
  //       ],
  //     },
  //     {
  //       title: 'item_disabled',
  //       path: '#disabled',
  //       icon: ICONS.menuItem,
  //       disabled: true,
  //     },
  //     {
  //       title: 'item_label',
  //       path: '#label',
  //       icon: ICONS.menuItem,
  //       info: (
  //         <Label color="info" startIcon={<Iconify icon="eva:email-fill" />}>
  //           NEW
  //         </Label>
  //       ),
  //     },
  //     {
  //       title: 'item_caption',
  //       path: '#caption',
  //       icon: ICONS.menuItem,
  //       caption: 'description',
  //     },
  //   ],
  // },
]

export default navConfig

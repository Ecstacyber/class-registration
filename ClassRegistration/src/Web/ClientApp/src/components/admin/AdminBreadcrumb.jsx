import React from 'react'
import { useLocation } from 'react-router-dom'

import AppRoutes from '../../AppRoutes'

import { CBreadcrumb, CBreadcrumbItem } from '@coreui/react'

const AdminBreadcrumb = () => {
    const currentLocation = useLocation().pathname;

    const getRouteName = (pathname, AppRoutes) => {
        const currentRoute = AppRoutes.find((route) => route.path === pathname);
        return currentRoute ? currentRoute.name : false;
    }

    const getBreadcrumbs = (location) => {
        const breadcrumbs = [];
        location.split('/').reduce((prev, curr, index, array) => {
            const currentPathname = `${prev}/${curr}`;
            const routeName = getRouteName(currentPathname, AppRoutes);
            routeName &&
                breadcrumbs.push({
                    pathname: currentPathname,
                    name: routeName,
                    active: index + 1 === array.length ? true : false,
                });
            return currentPathname;
        })
        return breadcrumbs;
    }

    const breadcrumbs = getBreadcrumbs(currentLocation);

    return (
        <CBreadcrumb className="my-0">
            {breadcrumbs.map((breadcrumb, index) => {
                return (
                    <CBreadcrumbItem
                        {...(breadcrumb.active ? { active: true } : { href: breadcrumb.pathname })}
                        key={index}
                    >
                        {breadcrumb.name}
                    </CBreadcrumbItem>
                )
            })}
        </CBreadcrumb>
    );
}

export default React.memo(AdminBreadcrumb);

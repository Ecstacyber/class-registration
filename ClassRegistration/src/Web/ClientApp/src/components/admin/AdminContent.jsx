import React, { Suspense } from 'react'
import { Navigate, Route, Routes } from 'react-router-dom'
import { CContainer, CSpinner } from '@coreui/react'

// routes config
import AppRoutes from '../../AppRoutes'

const AdminContent = () => {
    return (
        <CContainer className="px-4" lg>
            <Suspense fallback={<CSpinner color="primary" />}>
                <Routes>
                    {AppRoutes.map((route, idx) => {
                        return (
                            route.element && (
                                <Route
                                    key={idx}
                                    path={route.path}
                                    exact={route.exact}
                                    name={route.name}
                                    element={<route.element />}
                                />
                            )
                        )
                    })}
                    <Route path="/admin-index" element={<Navigate to="/admin-index" replace />} />
                </Routes>
            </Suspense>
        </CContainer>
    )
}

export default React.memo(AdminContent)

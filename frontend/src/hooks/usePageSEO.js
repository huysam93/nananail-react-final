/**
 * usePageSEO - Hook để set dynamic title và meta description cho từng page
 * Sử dụng: usePageSEO({ title: '...', description: '...' })
 */
import { useEffect } from 'react';

const BASE_TITLE = 'NanaNail - Tiệm Nail Số 1 Đà Lạt';
const BASE_DESCRIPTION = 'NanaNail - Tiệm nail chuyên nghiệp tại Đà Lạt. Dịch vụ sơn gel, nail art, chăm sóc móng cao cấp. Đặt lịch online 24/7.';

const usePageSEO = ({ title, description, keywords } = {}) => {
  useEffect(() => {
    // Title
    const fullTitle = title ? `${title} | NanaNail Đà Lạt` : BASE_TITLE;
    document.title = fullTitle;

    // Meta description
    let descTag = document.querySelector('meta[name="description"]');
    if (!descTag) {
      descTag = document.createElement('meta');
      descTag.setAttribute('name', 'description');
      document.head.appendChild(descTag);
    }
    descTag.setAttribute('content', description || BASE_DESCRIPTION);

    // Meta keywords
    if (keywords) {
      let kwTag = document.querySelector('meta[name="keywords"]');
      if (!kwTag) {
        kwTag = document.createElement('meta');
        kwTag.setAttribute('name', 'keywords');
        document.head.appendChild(kwTag);
      }
      kwTag.setAttribute('content', keywords);
    }

    // OG tags
    const setOG = (prop, val) => {
      let tag = document.querySelector(`meta[property="${prop}"]`);
      if (!tag) {
        tag = document.createElement('meta');
        tag.setAttribute('property', prop);
        document.head.appendChild(tag);
      }
      tag.setAttribute('content', val);
    };
    setOG('og:title', fullTitle);
    setOG('og:description', description || BASE_DESCRIPTION);
    setOG('og:type', 'website');
    setOG('og:locale', 'vi_VN');

    // Cleanup: reset khi unmount về default
    return () => {
      document.title = BASE_TITLE;
    };
  }, [title, description, keywords]);
};

export default usePageSEO;

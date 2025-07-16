--
-- PostgreSQL database dump
--

-- Dumped from database version 17.5 (Debian 17.5-1.pgdg120+1)
-- Dumped by pg_dump version 17.5 (Debian 17.5-1.pgdg120+1)

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET transaction_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- Name: public; Type: SCHEMA; Schema: -; Owner: sobo
--

-- *not* creating schema, since initdb creates it


ALTER SCHEMA public OWNER TO sobo;

--
-- Name: SCHEMA public; Type: COMMENT; Schema: -; Owner: sobo
--

COMMENT ON SCHEMA public IS '';


--
-- Name: GatewayType; Type: TYPE; Schema: public; Owner: sobo
--

CREATE TYPE public."GatewayType" AS ENUM (
    'Razorpay'
);


ALTER TYPE public."GatewayType" OWNER TO sobo;

--
-- Name: OrderStatus; Type: TYPE; Schema: public; Owner: sobo
--

CREATE TYPE public."OrderStatus" AS ENUM (
    'New',
    'Pending',
    'Success',
    'Failed'
);


ALTER TYPE public."OrderStatus" OWNER TO sobo;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: Gateway; Type: TABLE; Schema: public; Owner: sobo
--

CREATE TABLE public."Gateway" (
    id text NOT NULL,
    type public."GatewayType" NOT NULL
);


ALTER TABLE public."Gateway" OWNER TO sobo;

--
-- Name: Order; Type: TABLE; Schema: public; Owner: sobo
--

CREATE TABLE public."Order" (
    id text NOT NULL,
    "bookingId" text NOT NULL,
    amount double precision NOT NULL,
    status public."OrderStatus" NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL,
    "gatewayId" text
);


ALTER TABLE public."Order" OWNER TO sobo;

--
-- Name: Razorpay; Type: TABLE; Schema: public; Owner: sobo
--

CREATE TABLE public."Razorpay" (
    id text NOT NULL,
    "razorpayOrderId" text DEFAULT ''::text NOT NULL,
    "razorpayPaymentId" text DEFAULT ''::text NOT NULL,
    "razorpaySignature" text DEFAULT ''::text NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL,
    "gatewayId" text NOT NULL
);


ALTER TABLE public."Razorpay" OWNER TO sobo;

--
-- Name: WebhookEvent; Type: TABLE; Schema: public; Owner: sobo
--

CREATE TABLE public."WebhookEvent" (
    id text NOT NULL,
    "eventId" text NOT NULL,
    gateway public."GatewayType" NOT NULL,
    status text NOT NULL,
    "rawBody" jsonb NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "gatewayId" text DEFAULT ''::text NOT NULL
);


ALTER TABLE public."WebhookEvent" OWNER TO sobo;

--
-- Name: _prisma_migrations; Type: TABLE; Schema: public; Owner: sobo
--

CREATE TABLE public._prisma_migrations (
    id character varying(36) NOT NULL,
    checksum character varying(64) NOT NULL,
    finished_at timestamp with time zone,
    migration_name character varying(255) NOT NULL,
    logs text,
    rolled_back_at timestamp with time zone,
    started_at timestamp with time zone DEFAULT now() NOT NULL,
    applied_steps_count integer DEFAULT 0 NOT NULL
);


ALTER TABLE public._prisma_migrations OWNER TO sobo;

--
-- Data for Name: Gateway; Type: TABLE DATA; Schema: public; Owner: sobo
--

COPY public."Gateway" (id, type) FROM stdin;
cmbp1ny2m0001qk329ok4ohpr	Razorpay
cmbs525ww0001qk2pq4flusfy	Razorpay
cmbund1g70004mt0uscg8zwml	Razorpay
cmbuq4svp0001qs0t55syjiu6	Razorpay
cmc22mu4q0004npexd2u62sax	Razorpay
cmc68mc2f0001o7skpit30u1n	Razorpay
cmc6bapfj0001o7tbbfrzollj	Razorpay
cmc6bx1es0004o7tbd4xci8da	Razorpay
cmc6bz6ah0007o7tb9yqxqe08	Razorpay
cmc6c0fba000ao7tb8xs5jdm1	Razorpay
cmc6c23fp000do7tbc4dpdxkw	Razorpay
cmc6c483h000go7tbrhu42o1e	Razorpay
cmc8igzbi000ko7tbtc78ujgv	Razorpay
cmc8irvmz000oo7tb2w1a403o	Razorpay
cmc8ivc22000so7tbjaosv7d1	Razorpay
cmc8jjjni000xo7tbrym9v3ck	Razorpay
cmc8vldgc0011o7tbr4vdlxe2	Razorpay
cmc8vy4390001o7zue3bnrhng	Razorpay
cmc9117er0001o7k2w9ya9j3p	Razorpay
cmc91ovxt0004o7k2x2ddu502	Razorpay
cmc91r4hw0007o7k2z5c343dt	Razorpay
cmc974idg000bo7k2xkbnniu0	Razorpay
cmc97e5k8000eo7k2dkdm6mu5	Razorpay
cmc9827v0000ho7k21hvwy3r2	Razorpay
cmc983rz4000ko7k20k9u570n	Razorpay
cmc98hlca0001l70uc80780hn	Razorpay
cmc992gwi0004l70uax1wtyby	Razorpay
cmc9939lj0007l70uq7zfryl2	Razorpay
cmc995pv1000al70uodpgtgmv	Razorpay
cmc99acem000el70uae5ac1bn	Razorpay
cmcaumyi90001l72pp3pdp0jy	Razorpay
cmcg6g9ip0001ov1vbpiyqrv7	Razorpay
cmcyfzvi40001pj0untm7zb4a	Razorpay
cmczukqdn0001pj2bu2monf9l	Razorpay
\.


--
-- Data for Name: Order; Type: TABLE DATA; Schema: public; Owner: sobo
--

COPY public."Order" (id, "bookingId", amount, status, "createdAt", "updatedAt", "gatewayId") FROM stdin;
cmbp1ny2m0000qk32dowbokin	424344	800	Pending	2025-06-09 12:04:27.07	2025-06-09 12:04:29.199	cmbp1ny2m0001qk329ok4ohpr
cmbs525ww0000qk2p9pyxbgog	424345	800	Pending	2025-06-11 16:02:47.792	2025-06-11 16:02:51.257	cmbs525ww0001qk2pq4flusfy
cmbund1g70003mt0uz7i6desj	424346	800	New	2025-06-13 10:10:40.663	2025-06-13 10:10:40.663	cmbund1g70004mt0uscg8zwml
cmbuq4svo0000qs0tqi7gzdz4	424347	800	Pending	2025-06-13 11:28:15.155	2025-06-13 11:28:29.048	cmbuq4svp0001qs0t55syjiu6
cmc22mu4q0003npexg1nal32k	424348	800	Pending	2025-06-18 14:52:35.21	2025-06-18 14:52:37.75	cmc22mu4q0004npexd2u62sax
cmc68mc2e0000o7sk91xsvoyd	6856aac221710b331c6f6d2d	646	Pending	2025-06-21 12:51:14.198	2025-06-21 12:51:15.312	cmc68mc2f0001o7skpit30u1n
cmc6bapfj0000o7tb2do54qxt	6856bc52374865e1691dd95c	646	Pending	2025-06-21 14:06:10.48	2025-06-21 14:06:11.52	cmc6bapfj0001o7tbbfrzollj
cmc6bx1es0003o7tbgww5274z	6856c064374865e1691dda17	323	Pending	2025-06-21 14:23:32.42	2025-06-21 14:23:33.633	cmc6bx1es0004o7tbd4xci8da
cmc6bz6ah0006o7tb26k44j50	6856c0c8374865e1691dda53	323	Pending	2025-06-21 14:25:12.089	2025-06-21 14:25:12.288	cmc6bz6ah0007o7tb9yqxqe08
cmc6c0fb90009o7tblrk5ymdv	6856c102374865e1691dda99	646	Pending	2025-06-21 14:26:10.438	2025-06-21 14:26:10.685	cmc6c0fba000ao7tb8xs5jdm1
cmc6c23fp000co7tbmjybl5y2	6856c150374865e1691ddadf	646	Pending	2025-06-21 14:27:28.357	2025-06-21 14:27:28.569	cmc6c23fp000do7tbc4dpdxkw
cmc91r4hw0006o7k2v5nth92n	6859424a7dc39c6d43c06158	323	Success	2025-06-23 12:02:18.884	2025-06-23 12:03:15.783	cmc91r4hw0007o7k2z5c343dt
cmc6c483h000fo7tb65glf83p	6856c1b3374865e1691ddb2d	646	Success	2025-06-21 14:29:07.695	2025-06-21 14:30:23.432	cmc6c483h000go7tbrhu42o1e
cmc8igzbi000jo7tby2hmluva	6858c3c8374865e1691ddb94	642	Success	2025-06-23 03:02:32.891	2025-06-23 03:06:26.824	cmc8igzbi000ko7tbtc78ujgv
cmc974idg000ao7k2v8n28e8n	685965897dc39c6d43c06403	110	Pending	2025-06-23 14:32:41.462	2025-06-23 14:32:42.392	cmc974idg000bo7k2xkbnniu0
cmc8irvmz000no7tbxv5z1u7s	6858c5c5374865e1691ddc12	110	Success	2025-06-23 03:11:01.331	2025-06-23 03:11:50.534	cmc8irvmz000oo7tb2w1a403o
cmc97e5k8000do7k2xk5dciwr	6859674b7dc39c6d43c064ef	110	Pending	2025-06-23 14:40:11.413	2025-06-23 14:40:11.844	cmc97e5k8000eo7k2dkdm6mu5
cmc8ivc22000ro7tblnreya8l	6858c666374865e1691ddc60	350	Success	2025-06-23 03:13:42.602	2025-06-23 03:15:32.284	cmc8ivc22000so7tbjaosv7d1
cmc8jjjni000wo7tbsmfizo3k	6858cad0374865e1691ddcb6	248	Success	2025-06-23 03:32:32.167	2025-06-23 03:33:29.08	cmc8jjjni000xo7tbrym9v3ck
cmc9827v0000go7k2pioeq0c0	68596bae7dc39c6d43c06546	810	Pending	2025-06-23 14:58:54.133	2025-06-23 14:58:56.296	cmc9827v0000ho7k21hvwy3r2
cmc8vldgc0010o7tbqqpgpdki	685919e0374865e1691ddd7c	646	Success	2025-06-23 09:09:52.847	2025-06-23 09:10:38.266	cmc8vldgc0011o7tbr4vdlxe2
cmc8vy4390000o7zu70gg7g3z	68591c332b11228e20d4f2eb	323	Success	2025-06-23 09:19:47.231	2025-06-23 09:20:22.442	cmc8vy4390001o7zue3bnrhng
cmc9117er0000o7k2xlatki5h	68593d917dc39c6d43c06102	646	Pending	2025-06-23 11:42:09.585	2025-06-23 11:42:10.751	cmc9117er0001o7k2w9ya9j3p
cmc91ovxt0003o7k2p7ldd723	685941e27dc39c6d43c0611c	646	Pending	2025-06-23 12:00:34.468	2025-06-23 12:00:35.728	cmc91ovxt0004o7k2x2ddu502
cmcyfzvi40000pj0ui69mxi97	6870b0a4f638d3e3db391568	646	Success	2025-07-11 06:35:16.153	2025-07-11 06:36:49.506	cmcyfzvi40001pj0untm7zb4a
cmc983rz4000jo7k2gblokxlq	68596bf67dc39c6d43c0657f	810	Pending	2025-06-23 15:00:06.88	2025-06-23 15:00:07.202	cmc983rz4000ko7k20k9u570n
cmc98hlca0000l70uytxpndcu	68596e7b8192f472f4e8985d	1215	Pending	2025-06-23 15:10:51.462	2025-06-23 15:10:51.768	cmc98hlca0001l70uc80780hn
cmc992gwi0003l70uarnh0q9z	685972498192f472f4e898a6	294	Pending	2025-06-23 15:27:05.474	2025-06-23 15:27:06.638	cmc992gwi0004l70uax1wtyby
cmc9939lj0006l70u360tzw16	6859726e8192f472f4e898d7	248	Pending	2025-06-23 15:27:42.679	2025-06-23 15:27:42.882	cmc9939lj0007l70uq7zfryl2
cmc995pv10009l70unt71jqds	685972e18192f472f4e89908	262	Success	2025-06-23 15:29:37.069	2025-06-23 15:30:36.599	cmc995pv1000al70uodpgtgmv
cmc99acem000dl70uy10wti28	685973b88192f472f4e8995f	262	Success	2025-06-23 15:33:12.889	2025-06-23 15:33:36.15	cmc99acem000el70uae5ac1bn
cmcaumyi90000l72p1c40bnou	685aebff8ccaf29b35c5eea1	323	Pending	2025-06-24 18:18:39.518	2025-06-24 18:18:40.691	cmcaumyi90001l72pp3pdp0jy
cmczukqdm0000pj2bsotiybwd	6871fc7e41f0a590163d83f1	323	Success	2025-07-12 06:11:10.088	2025-07-12 06:11:27.077	cmczukqdn0001pj2bu2monf9l
cmcg6g9ip0000ov1vri0mj968	685fd67dd6725cef549bce8d	323	Success	2025-06-28 11:48:13.47	2025-06-28 11:48:36.369	cmcg6g9ip0001ov1vbpiyqrv7
\.


--
-- Data for Name: Razorpay; Type: TABLE DATA; Schema: public; Owner: sobo
--

COPY public."Razorpay" (id, "razorpayOrderId", "razorpayPaymentId", "razorpaySignature", "createdAt", "updatedAt", "gatewayId") FROM stdin;
cmbp1ny2m0002qk32dnyu6i5j	order_Qf5hQ7iDTU0urd			2025-06-09 12:04:27.07	2025-06-09 12:04:29.199	cmbp1ny2m0001qk329ok4ohpr
cmbs525ww0002qk2plyrwyvka	order_QfwpSN8DPEaXvM			2025-06-11 16:02:47.792	2025-06-11 16:02:51.257	cmbs525ww0001qk2pq4flusfy
cmbund1g70005mt0upmxi8e9h				2025-06-13 10:10:40.663	2025-06-13 10:10:40.663	cmbund1g70004mt0uscg8zwml
cmbuq4svp0002qs0txp81g4az	order_QgfDkyC7fifeAu			2025-06-13 11:28:15.155	2025-06-13 11:28:29.048	cmbuq4svp0001qs0t55syjiu6
cmc22mu4q0005npexjazttksn	order_QihN6pAZyZq0KT			2025-06-18 14:52:35.21	2025-06-18 14:52:37.75	cmc22mu4q0004npexd2u62sax
cmc68mc2f0002o7skbc00vwqr	order_QjquGvTSDZ8Hjy			2025-06-21 12:51:14.198	2025-06-21 12:51:15.312	cmc68mc2f0001o7skpit30u1n
cmc6bapfj0002o7tb8keesfav	order_QjsBQiuRq2GIyg			2025-06-21 14:06:10.48	2025-06-21 14:06:11.52	cmc6bapfj0001o7tbbfrzollj
cmc6bx1es0005o7tbwago8yj6	order_QjsTmCgw1jn1zA			2025-06-21 14:23:32.42	2025-06-21 14:23:33.633	cmc6bx1es0004o7tbd4xci8da
cmc6bz6ai0008o7tbmv01qx65	order_QjsVVxkkfC9Nfy			2025-06-21 14:25:12.089	2025-06-21 14:25:12.288	cmc6bz6ah0007o7tb9yqxqe08
cmc6c0fba000bo7tbp483gy55	order_QjsWXhxia98IQd			2025-06-21 14:26:10.438	2025-06-21 14:26:10.685	cmc6c0fba000ao7tb8xs5jdm1
cmc6c23fp000eo7tb9ui897qh	order_QjsXuiOnoDPkzJ			2025-06-21 14:27:28.357	2025-06-21 14:27:28.569	cmc6c23fp000do7tbc4dpdxkw
cmc97e5k8000fo7k2087eht38	order_QkfpakthMSvasO			2025-06-23 14:40:11.413	2025-06-23 14:40:11.844	cmc97e5k8000eo7k2dkdm6mu5
cmc6c483h000ho7tbui7okkmq	order_QjsZfG7he2jYZu	pay_QjsanMnoVPdxQA	baca059eaac156652abe08f2662513be5a506a5866f80acd57d9181fd031c352	2025-06-21 14:29:07.695	2025-06-21 14:30:23.432	cmc6c483h000go7tbrhu42o1e
cmc8igzbi000lo7tbq5h7lydj	order_QkTwexv1OquPWh	pay_QkU0Z4cLaY0plR	c39687b305418c46e2fd0b4ef07648a51c0bc98c5ff35ed8000d6b3e2b32cacf	2025-06-23 03:02:32.891	2025-06-23 03:06:26.824	cmc8igzbi000ko7tbtc78ujgv
cmc9827v0000io7k2d4xn4d6x	order_Qkg9O9pTU1VKKq			2025-06-23 14:58:54.133	2025-06-23 14:58:56.296	cmc9827v0000ho7k21hvwy3r2
cmc8irvmz000po7tbrgvft77d	order_QkU5bDMIPNZJbk	pay_QkU6Eni4IVj69O	4fec1bf79c77d75ca07ba5a9ab3dca2b3892ad505fac8b08f39a7c266ee37808	2025-06-23 03:11:01.331	2025-06-23 03:11:50.534	cmc8irvmz000oo7tb2w1a403o
cmc983rz4000lo7k2dq2ds66w	order_QkgAdWfCjgSaeR			2025-06-23 15:00:06.88	2025-06-23 15:00:07.202	cmc983rz4000ko7k20k9u570n
cmc8ivc22000to7tbckxurnks	order_QkU8Rb0prlyOKH	pay_QkUADk97JKacQP	9e34bf9002bc827d479fd9d6b71b534006e960a672854d57f248c03816c28e48	2025-06-23 03:13:42.602	2025-06-23 03:15:32.284	cmc8ivc22000so7tbjaosv7d1
cmc8jjjni000yo7tbven6o4ka	order_QkUSKzWNvAnsH0	pay_QkUT5rAI81n1j6	7c210d164ee4c918c58e1bedb5f1af71966827c06aa9f7d9a2921e94dc742185	2025-06-23 03:32:32.167	2025-06-23 03:33:29.08	cmc8jjjni000xo7tbrym9v3ck
cmc98hlca0002l70unocrg3xl	order_QkgLz8kuSfVCUh			2025-06-23 15:10:51.462	2025-06-23 15:10:51.768	cmc98hlca0001l70uc80780hn
cmc8vldgc0012o7tbkuzd6obz	order_QkaCgi5fFT6fZO	pay_QkaDGdzN7PGvbz	a12c85dbb0b94c0d597287521308add69d9a43926d804254089fc1f6862040d2	2025-06-23 09:09:52.847	2025-06-23 09:10:38.266	cmc8vldgc0011o7tbr4vdlxe2
cmc8vy4390002o7zua2u428nf	order_QkaN8YQrVzyFle	pay_QkaNi8PCb6pQUR	c368c5e528d2a2c355c0168f776570ec3177aa588137c52c451dd1b785b29c63	2025-06-23 09:19:47.231	2025-06-23 09:20:22.442	cmc8vy4390001o7zue3bnrhng
cmc9117er0002o7k25n511hv5	order_QkcnXrHyL2EBsO			2025-06-23 11:42:09.585	2025-06-23 11:42:10.751	cmc9117er0001o7k2w9ya9j3p
cmc91ovxt0005o7k22eee3oms	order_Qkd6zstfsaRKIm			2025-06-23 12:00:34.468	2025-06-23 12:00:35.728	cmc91ovxt0004o7k2x2ddu502
cmc992gwi0005l70uhe6t9hr0	order_Qkgd9ERxZqaupp			2025-06-23 15:27:05.474	2025-06-23 15:27:06.638	cmc992gwi0004l70uax1wtyby
cmc91r4hw0008o7k2ky9byy61	order_Qkd8p0qwFTaFvj	pay_Qkd9ftjbdX3yKg	f3128a6e15fec3d8f0152ff2008a123917f4c68a89674b5d43fb447a7b109a88	2025-06-23 12:02:18.884	2025-06-23 12:03:15.783	cmc91r4hw0007o7k2z5c343dt
cmc974idg000co7k2tjl7owbn	order_QkfhgC7IItSxnX			2025-06-23 14:32:41.462	2025-06-23 14:32:42.392	cmc974idg000bo7k2xkbnniu0
cmc9939lj0008l70ump04x65p	order_QkgdmoZ1jWRECH			2025-06-23 15:27:42.679	2025-06-23 15:27:42.882	cmc9939lj0007l70uq7zfryl2
cmc995pv2000bl70uj05a8j37	order_Qkgfnj5Qd7SU1w	pay_QkggTLucyLFncc	8279f27a8456fd764937699c2d70394d69dca797ecd6a36f825152526ee32476	2025-06-23 15:29:37.069	2025-06-23 15:30:36.599	cmc995pv1000al70uodpgtgmv
cmc99acem000fl70u3ulprray	order_QkgjbIp4qXSebw	pay_QkgjskRS2XPUpV	8f02c73aacfcd247751dd75a06700a6d47b48ac717f1cd76f2c97ba96461799b	2025-06-23 15:33:12.889	2025-06-23 15:33:36.15	cmc99acem000el70uae5ac1bn
cmcaumyi90002l72p7pcwps7c	order_Ql85V8agLrUvZN			2025-06-24 18:18:39.518	2025-06-24 18:18:40.691	cmcaumyi90001l72pp3pdp0jy
cmcg6g9ip0002ov1vj201w9j7	order_QmbZYfSGhmVZCd	pay_QmbZt1gSXCHbmQ	2a01161512cf54531abd335f358474c9e7c8884d701c61f0456aa8f7d30e8ecf	2025-06-28 11:48:13.47	2025-06-28 11:48:36.369	cmcg6g9ip0001ov1vbpiyqrv7
cmcyfzvi40002pj0ufhburekz	order_QrfBXB99PxvKSm	pay_QrfD6jpmP5LahP	5d2091af3d96eb50808f6564c5862d52d8696a8e531f909660725f14a938a97f	2025-07-11 06:35:16.153	2025-07-11 06:36:49.506	cmcyfzvi40001pj0untm7zb4a
cmczukqdn0002pj2bm6j1x5xr	order_Qs3JCHTj7FGSzF	pay_Qs3JPO7cTlzePQ	b07dc86c4f35a00d86e37af6d31dd027aec5f87512c4adb030d59e193d6999e3	2025-07-12 06:11:10.088	2025-07-12 06:11:27.077	cmczukqdn0001pj2bu2monf9l
\.


--
-- Data for Name: WebhookEvent; Type: TABLE DATA; Schema: public; Owner: sobo
--

COPY public."WebhookEvent" (id, "eventId", gateway, status, "rawBody", "createdAt", "gatewayId") FROM stdin;
cmc6c5uj6000io7tbw7ihhnzg	Qjsaym1HBfKnXp	Razorpay	payment.captured	"{\\"entity\\":\\"event\\",\\"account_id\\":\\"acc_QViyeXMhERgjlQ\\",\\"event\\":\\"payment.captured\\",\\"contains\\":[\\"payment\\"],\\"payload\\":{\\"payment\\":{\\"entity\\":{\\"id\\":\\"pay_QjsanMnoVPdxQA\\",\\"entity\\":\\"payment\\",\\"amount\\":64600,\\"currency\\":\\"INR\\",\\"status\\":\\"captured\\",\\"order_id\\":\\"order_QjsZfG7he2jYZu\\",\\"invoice_id\\":null,\\"international\\":false,\\"method\\":\\"card\\",\\"amount_refunded\\":0,\\"refund_status\\":null,\\"captured\\":true,\\"description\\":\\"Amazing Location - A short walk to Adventure! booking for 2 nights\\",\\"card_id\\":\\"card_QjsanbTXv4CvZR\\",\\"card\\":{\\"id\\":\\"card_QjsanbTXv4CvZR\\",\\"entity\\":\\"card\\",\\"name\\":\\"\\",\\"last4\\":\\"5449\\",\\"network\\":\\"MasterCard\\",\\"type\\":\\"credit\\",\\"issuer\\":\\"UTIB\\",\\"international\\":false,\\"emi\\":false,\\"sub_type\\":\\"consumer\\",\\"token_iin\\":null},\\"bank\\":null,\\"wallet\\":null,\\"vpa\\":null,\\"email\\":\\"imsouveek@gmail.com\\",\\"contact\\":\\"+919007055904\\",\\"notes\\":[],\\"fee\\":1292,\\"tax\\":0,\\"error_code\\":null,\\"error_description\\":null,\\"error_source\\":null,\\"error_step\\":null,\\"error_reason\\":null,\\"acquirer_data\\":{\\"auth_code\\":\\"633467\\"},\\"created_at\\":1750516213,\\"reward\\":null,\\"base_amount\\":64600}}},\\"created_at\\":1750516222}"	2025-06-21 14:30:23.443	cmc6c483h000go7tbrhu42o1e
cmc8ilzte000mo7tb5rr46o6n	QkU0kRbNyVvSUb	Razorpay	payment.captured	"{\\"entity\\":\\"event\\",\\"account_id\\":\\"acc_QViyeXMhERgjlQ\\",\\"event\\":\\"payment.captured\\",\\"contains\\":[\\"payment\\"],\\"payload\\":{\\"payment\\":{\\"entity\\":{\\"id\\":\\"pay_QkU0Z4cLaY0plR\\",\\"entity\\":\\"payment\\",\\"amount\\":64200,\\"currency\\":\\"INR\\",\\"status\\":\\"captured\\",\\"order_id\\":\\"order_QkTwexv1OquPWh\\",\\"invoice_id\\":null,\\"international\\":false,\\"method\\":\\"card\\",\\"amount_refunded\\":0,\\"refund_status\\":null,\\"captured\\":true,\\"description\\":\\"Modern Lodge In The Mountains booking for 2 nights\\",\\"card_id\\":\\"card_QkU0ZHTzGGPS2o\\",\\"card\\":{\\"id\\":\\"card_QkU0ZHTzGGPS2o\\",\\"entity\\":\\"card\\",\\"name\\":\\"\\",\\"last4\\":\\"5449\\",\\"network\\":\\"MasterCard\\",\\"type\\":\\"credit\\",\\"issuer\\":\\"UTIB\\",\\"international\\":false,\\"emi\\":false,\\"sub_type\\":\\"consumer\\",\\"token_iin\\":null},\\"bank\\":null,\\"wallet\\":null,\\"vpa\\":null,\\"email\\":\\"imsouveek@gmail.com\\",\\"contact\\":\\"+919007055904\\",\\"notes\\":[],\\"fee\\":1284,\\"tax\\":0,\\"error_code\\":null,\\"error_description\\":null,\\"error_source\\":null,\\"error_step\\":null,\\"error_reason\\":null,\\"acquirer_data\\":{\\"auth_code\\":\\"102719\\"},\\"created_at\\":1750647976,\\"reward\\":null,\\"base_amount\\":64200}}},\\"created_at\\":1750647985}"	2025-06-23 03:06:26.834	cmc8igzbi000ko7tbtc78ujgv
cmc8isxl9000qo7tbz40b3kdn	QkU6RhI9vRgDYB	Razorpay	payment.captured	"{\\"entity\\":\\"event\\",\\"account_id\\":\\"acc_QViyeXMhERgjlQ\\",\\"event\\":\\"payment.captured\\",\\"contains\\":[\\"payment\\"],\\"payload\\":{\\"payment\\":{\\"entity\\":{\\"id\\":\\"pay_QkU6Eni4IVj69O\\",\\"entity\\":\\"payment\\",\\"amount\\":11000,\\"currency\\":\\"INR\\",\\"status\\":\\"captured\\",\\"order_id\\":\\"order_QkU5bDMIPNZJbk\\",\\"invoice_id\\":null,\\"international\\":false,\\"method\\":\\"card\\",\\"amount_refunded\\":0,\\"refund_status\\":null,\\"captured\\":true,\\"description\\":\\"Small Shed Out Back booking for 2 nights\\",\\"card_id\\":\\"card_QkU6F0nXQJJBXg\\",\\"card\\":{\\"id\\":\\"card_QkU6F0nXQJJBXg\\",\\"entity\\":\\"card\\",\\"name\\":\\"\\",\\"last4\\":\\"5449\\",\\"network\\":\\"MasterCard\\",\\"type\\":\\"credit\\",\\"issuer\\":\\"UTIB\\",\\"international\\":false,\\"emi\\":false,\\"sub_type\\":\\"consumer\\",\\"token_iin\\":null},\\"bank\\":null,\\"wallet\\":null,\\"vpa\\":null,\\"email\\":\\"imsouveek@gmail.com\\",\\"contact\\":\\"+919007055904\\",\\"notes\\":[],\\"fee\\":220,\\"tax\\":0,\\"error_code\\":null,\\"error_description\\":null,\\"error_source\\":null,\\"error_step\\":null,\\"error_reason\\":null,\\"acquirer_data\\":{\\"auth_code\\":\\"622569\\"},\\"created_at\\":1750648298,\\"reward\\":null,\\"base_amount\\":11000}}},\\"created_at\\":1750648309}"	2025-06-23 03:11:50.541	cmc8irvmz000oo7tb2w1a403o
cmc8iwk26000uo7tb17m4n9hb	QkU9R4iEMmqRpA	Razorpay	payment.failed	"{\\"entity\\":\\"event\\",\\"account_id\\":\\"acc_QViyeXMhERgjlQ\\",\\"event\\":\\"payment.failed\\",\\"contains\\":[\\"payment\\"],\\"payload\\":{\\"payment\\":{\\"entity\\":{\\"id\\":\\"pay_QkU9C57ddFbCcR\\",\\"entity\\":\\"payment\\",\\"amount\\":35000,\\"currency\\":\\"INR\\",\\"status\\":\\"failed\\",\\"order_id\\":\\"order_QkU8Rb0prlyOKH\\",\\"invoice_id\\":null,\\"international\\":false,\\"method\\":\\"card\\",\\"amount_refunded\\":0,\\"refund_status\\":null,\\"captured\\":false,\\"description\\":\\"Cute Ski Chalet With Private Lift booking for 2 nights\\",\\"card_id\\":\\"card_QkU9CKxJRJBRxf\\",\\"card\\":{\\"id\\":\\"card_QkU9CKxJRJBRxf\\",\\"entity\\":\\"card\\",\\"name\\":\\"\\",\\"last4\\":\\"5449\\",\\"network\\":\\"MasterCard\\",\\"type\\":\\"credit\\",\\"issuer\\":\\"UTIB\\",\\"international\\":false,\\"emi\\":false,\\"sub_type\\":\\"consumer\\",\\"token_iin\\":null},\\"bank\\":null,\\"wallet\\":null,\\"vpa\\":null,\\"email\\":\\"imsouveek@gmail.com\\",\\"contact\\":\\"+919007055904\\",\\"notes\\":[],\\"fee\\":null,\\"tax\\":null,\\"error_code\\":\\"BAD_REQUEST_ERROR\\",\\"error_description\\":\\"Payment failed\\",\\"error_source\\":\\"gateway\\",\\"error_step\\":\\"payment_authorization\\",\\"error_reason\\":\\"payment_failed\\",\\"acquirer_data\\":{\\"auth_code\\":null},\\"created_at\\":1750648466,\\"reward\\":null}}},\\"created_at\\":1750648479}"	2025-06-23 03:14:39.63	cmc8ivc22000so7tbjaosv7d1
cmc8ixop2000vo7tbwzbouna9	QkUALpRBzEwY08	Razorpay	payment.captured	"{\\"entity\\":\\"event\\",\\"account_id\\":\\"acc_QViyeXMhERgjlQ\\",\\"event\\":\\"payment.captured\\",\\"contains\\":[\\"payment\\"],\\"payload\\":{\\"payment\\":{\\"entity\\":{\\"id\\":\\"pay_QkUADk97JKacQP\\",\\"entity\\":\\"payment\\",\\"amount\\":35000,\\"currency\\":\\"INR\\",\\"status\\":\\"captured\\",\\"order_id\\":\\"order_QkU8Rb0prlyOKH\\",\\"invoice_id\\":null,\\"international\\":false,\\"method\\":\\"card\\",\\"amount_refunded\\":0,\\"refund_status\\":null,\\"captured\\":true,\\"description\\":\\"Cute Ski Chalet With Private Lift booking for 2 nights\\",\\"card_id\\":\\"card_QkUADwtOnQVUM8\\",\\"card\\":{\\"id\\":\\"card_QkUADwtOnQVUM8\\",\\"entity\\":\\"card\\",\\"name\\":\\"\\",\\"last4\\":\\"5449\\",\\"network\\":\\"MasterCard\\",\\"type\\":\\"credit\\",\\"issuer\\":\\"UTIB\\",\\"international\\":false,\\"emi\\":false,\\"sub_type\\":\\"consumer\\",\\"token_iin\\":null},\\"bank\\":null,\\"wallet\\":null,\\"vpa\\":null,\\"email\\":\\"imsouveek@gmail.com\\",\\"contact\\":\\"+919007055904\\",\\"notes\\":[],\\"fee\\":700,\\"tax\\":0,\\"error_code\\":null,\\"error_description\\":null,\\"error_source\\":null,\\"error_step\\":null,\\"error_reason\\":null,\\"acquirer_data\\":{\\"auth_code\\":\\"524601\\"},\\"created_at\\":1750648524,\\"reward\\":null,\\"base_amount\\":35000}}},\\"created_at\\":1750648531}"	2025-06-23 03:15:32.294	cmc8ivc22000so7tbjaosv7d1
cmc8jkrk0000zo7tb4poqiqdt	QkUTJBrC68qZwo	Razorpay	payment.captured	"{\\"entity\\":\\"event\\",\\"account_id\\":\\"acc_QViyeXMhERgjlQ\\",\\"event\\":\\"payment.captured\\",\\"contains\\":[\\"payment\\"],\\"payload\\":{\\"payment\\":{\\"entity\\":{\\"id\\":\\"pay_QkUT5rAI81n1j6\\",\\"entity\\":\\"payment\\",\\"amount\\":24800,\\"currency\\":\\"INR\\",\\"status\\":\\"captured\\",\\"order_id\\":\\"order_QkUSKzWNvAnsH0\\",\\"invoice_id\\":null,\\"international\\":false,\\"method\\":\\"card\\",\\"amount_refunded\\":0,\\"refund_status\\":null,\\"captured\\":true,\\"description\\":\\"A Quiet House in the Middle of Nowhere booking for 2 nights\\",\\"card_id\\":\\"card_QkUT64zlCYxGLw\\",\\"card\\":{\\"id\\":\\"card_QkUT64zlCYxGLw\\",\\"entity\\":\\"card\\",\\"name\\":\\"\\",\\"last4\\":\\"5449\\",\\"network\\":\\"MasterCard\\",\\"type\\":\\"credit\\",\\"issuer\\":\\"UTIB\\",\\"international\\":false,\\"emi\\":false,\\"sub_type\\":\\"consumer\\",\\"token_iin\\":null},\\"bank\\":null,\\"wallet\\":null,\\"vpa\\":null,\\"email\\":\\"imsouveek@gmail.com\\",\\"contact\\":\\"+919007055904\\",\\"notes\\":[],\\"fee\\":496,\\"tax\\":0,\\"error_code\\":null,\\"error_description\\":null,\\"error_source\\":null,\\"error_step\\":null,\\"error_reason\\":null,\\"acquirer_data\\":{\\"auth_code\\":\\"463135\\"},\\"created_at\\":1750649596,\\"reward\\":null,\\"base_amount\\":24800}}},\\"created_at\\":1750649608}"	2025-06-23 03:33:29.089	cmc8jjjni000xo7tbrym9v3ck
cmc8vmci20013o7tb8n8jab4y	QkaDSBo9Dxggcn	Razorpay	payment.captured	"{\\"entity\\":\\"event\\",\\"account_id\\":\\"acc_QViyeXMhERgjlQ\\",\\"event\\":\\"payment.captured\\",\\"contains\\":[\\"payment\\"],\\"payload\\":{\\"payment\\":{\\"entity\\":{\\"id\\":\\"pay_QkaDGdzN7PGvbz\\",\\"entity\\":\\"payment\\",\\"amount\\":64600,\\"currency\\":\\"INR\\",\\"status\\":\\"captured\\",\\"order_id\\":\\"order_QkaCgi5fFT6fZO\\",\\"invoice_id\\":null,\\"international\\":false,\\"method\\":\\"card\\",\\"amount_refunded\\":0,\\"refund_status\\":null,\\"captured\\":true,\\"description\\":\\"Amazing Location - A short walk to Adventure! booking for 2 nights\\",\\"card_id\\":\\"card_QkaDI4KPZeoyzd\\",\\"card\\":{\\"id\\":\\"card_QkaDI4KPZeoyzd\\",\\"entity\\":\\"card\\",\\"name\\":\\"\\",\\"last4\\":\\"5449\\",\\"network\\":\\"MasterCard\\",\\"type\\":\\"credit\\",\\"issuer\\":\\"UTIB\\",\\"international\\":false,\\"emi\\":false,\\"sub_type\\":\\"consumer\\",\\"token_iin\\":null},\\"bank\\":null,\\"wallet\\":null,\\"vpa\\":null,\\"email\\":\\"imsouveek@gmail.com\\",\\"contact\\":\\"+919007055904\\",\\"notes\\":[],\\"fee\\":1292,\\"tax\\":0,\\"error_code\\":null,\\"error_description\\":null,\\"error_source\\":null,\\"error_step\\":null,\\"error_reason\\":null,\\"acquirer_data\\":{\\"auth_code\\":\\"649914\\"},\\"created_at\\":1750669830,\\"reward\\":null,\\"base_amount\\":64600}}},\\"created_at\\":1750669837}"	2025-06-23 09:10:38.282	cmc8vldgc0011o7tbr4vdlxe2
cmc8vyv900003o7zuoape0o5d	QkaNjqN0HnWR94	Razorpay	payment.captured	"{\\"entity\\":\\"event\\",\\"account_id\\":\\"acc_QViyeXMhERgjlQ\\",\\"event\\":\\"payment.captured\\",\\"contains\\":[\\"payment\\"],\\"payload\\":{\\"payment\\":{\\"entity\\":{\\"id\\":\\"pay_QkaNi8PCb6pQUR\\",\\"entity\\":\\"payment\\",\\"amount\\":32300,\\"currency\\":\\"INR\\",\\"status\\":\\"captured\\",\\"order_id\\":\\"order_QkaN8YQrVzyFle\\",\\"invoice_id\\":null,\\"international\\":false,\\"method\\":\\"upi\\",\\"amount_refunded\\":0,\\"refund_status\\":null,\\"captured\\":true,\\"description\\":\\"Amazing Location - A short walk to Adventure! booking for 1 nights\\",\\"card_id\\":null,\\"bank\\":null,\\"wallet\\":null,\\"vpa\\":\\"success@razorpay\\",\\"email\\":\\"imsouveek@gmail.com\\",\\"contact\\":\\"+919007055904\\",\\"notes\\":[],\\"fee\\":762,\\"tax\\":116,\\"error_code\\":null,\\"error_description\\":null,\\"error_source\\":null,\\"error_step\\":null,\\"error_reason\\":null,\\"acquirer_data\\":{\\"rrn\\":\\"184236364170\\",\\"upi_transaction_id\\":\\"C33F78A2652AFB3DD3504689E06E737D\\"},\\"created_at\\":1750670420,\\"reward\\":null,\\"upi\\":{\\"vpa\\":\\"success@razorpay\\"},\\"base_amount\\":32300}}},\\"created_at\\":1750670421}"	2025-06-23 09:20:22.452	cmc8vy4390001o7zue3bnrhng
cmc91scew0009o7k2kqchvd47	Qkd9nmHdVXVkMh	Razorpay	payment.captured	"{\\"entity\\":\\"event\\",\\"account_id\\":\\"acc_QViyeXMhERgjlQ\\",\\"event\\":\\"payment.captured\\",\\"contains\\":[\\"payment\\"],\\"payload\\":{\\"payment\\":{\\"entity\\":{\\"id\\":\\"pay_Qkd9ftjbdX3yKg\\",\\"entity\\":\\"payment\\",\\"amount\\":32300,\\"currency\\":\\"INR\\",\\"status\\":\\"captured\\",\\"order_id\\":\\"order_Qkd8p0qwFTaFvj\\",\\"invoice_id\\":null,\\"international\\":false,\\"method\\":\\"card\\",\\"amount_refunded\\":0,\\"refund_status\\":null,\\"captured\\":true,\\"description\\":\\"Amazing Location - A short walk to Adventure! booking for 1 nights\\",\\"card_id\\":\\"card_Qkd9g7SC9TmZbx\\",\\"card\\":{\\"id\\":\\"card_Qkd9g7SC9TmZbx\\",\\"entity\\":\\"card\\",\\"name\\":\\"\\",\\"last4\\":\\"5449\\",\\"network\\":\\"MasterCard\\",\\"type\\":\\"credit\\",\\"issuer\\":\\"UTIB\\",\\"international\\":false,\\"emi\\":false,\\"sub_type\\":\\"consumer\\",\\"token_iin\\":null},\\"bank\\":null,\\"wallet\\":null,\\"vpa\\":null,\\"email\\":\\"imsouveek@gmail.com\\",\\"contact\\":\\"+919007055904\\",\\"notes\\":[],\\"fee\\":646,\\"tax\\":0,\\"error_code\\":null,\\"error_description\\":null,\\"error_source\\":null,\\"error_step\\":null,\\"error_reason\\":null,\\"acquirer_data\\":{\\"auth_code\\":\\"116329\\"},\\"created_at\\":1750680188,\\"reward\\":null,\\"base_amount\\":32300}}},\\"created_at\\":1750680194}"	2025-06-23 12:03:15.8	cmc91r4hw0007o7k2z5c343dt
cmc996zt4000cl70u7d77xpod	QkggpYE0Tbpcaq	Razorpay	payment.captured	"{\\"entity\\":\\"event\\",\\"account_id\\":\\"acc_QViyeXMhERgjlQ\\",\\"event\\":\\"payment.captured\\",\\"contains\\":[\\"payment\\"],\\"payload\\":{\\"payment\\":{\\"entity\\":{\\"id\\":\\"pay_QkggTLucyLFncc\\",\\"entity\\":\\"payment\\",\\"amount\\":26200,\\"currency\\":\\"INR\\",\\"status\\":\\"captured\\",\\"order_id\\":\\"order_Qkgfnj5Qd7SU1w\\",\\"invoice_id\\":null,\\"international\\":false,\\"method\\":\\"card\\",\\"amount_refunded\\":0,\\"refund_status\\":null,\\"captured\\":true,\\"description\\":\\"Party House With Fun Neighbors booking for 1 nights\\",\\"card_id\\":\\"card_QkggTacTMyc3OX\\",\\"card\\":{\\"id\\":\\"card_QkggTacTMyc3OX\\",\\"entity\\":\\"card\\",\\"name\\":\\"\\",\\"last4\\":\\"0153\\",\\"network\\":\\"Visa\\",\\"type\\":\\"credit\\",\\"issuer\\":\\"UTIB\\",\\"international\\":false,\\"emi\\":true,\\"sub_type\\":\\"consumer\\",\\"token_iin\\":null},\\"bank\\":null,\\"wallet\\":null,\\"vpa\\":null,\\"email\\":\\"imsouveek@gmail.com\\",\\"contact\\":\\"+919007055904\\",\\"notes\\":[],\\"fee\\":524,\\"tax\\":0,\\"error_code\\":null,\\"error_description\\":null,\\"error_source\\":null,\\"error_step\\":null,\\"error_reason\\":null,\\"acquirer_data\\":{\\"auth_code\\":\\"404644\\"},\\"created_at\\":1750692616,\\"reward\\":null,\\"base_amount\\":26200}}},\\"created_at\\":1750692635}"	2025-06-23 15:30:36.617	cmc995pv1000al70uodpgtgmv
cmc99aucn000gl70uuda24cc2	QkgjzXrGi3D0um	Razorpay	payment.captured	"{\\"entity\\":\\"event\\",\\"account_id\\":\\"acc_QViyeXMhERgjlQ\\",\\"event\\":\\"payment.captured\\",\\"contains\\":[\\"payment\\"],\\"payload\\":{\\"payment\\":{\\"entity\\":{\\"id\\":\\"pay_QkgjskRS2XPUpV\\",\\"entity\\":\\"payment\\",\\"amount\\":26200,\\"currency\\":\\"INR\\",\\"status\\":\\"captured\\",\\"order_id\\":\\"order_QkgjbIp4qXSebw\\",\\"invoice_id\\":null,\\"international\\":false,\\"method\\":\\"card\\",\\"amount_refunded\\":0,\\"refund_status\\":null,\\"captured\\":true,\\"description\\":\\"Party House With Fun Neighbors booking for 1 nights\\",\\"card_id\\":\\"card_QkgjsxKPL9FO7L\\",\\"card\\":{\\"id\\":\\"card_QkgjsxKPL9FO7L\\",\\"entity\\":\\"card\\",\\"name\\":\\"\\",\\"last4\\":\\"0153\\",\\"network\\":\\"Visa\\",\\"type\\":\\"credit\\",\\"issuer\\":\\"UTIB\\",\\"international\\":false,\\"emi\\":true,\\"sub_type\\":\\"consumer\\",\\"token_iin\\":null},\\"bank\\":null,\\"wallet\\":null,\\"vpa\\":null,\\"email\\":\\"imsouveek@gmail.com\\",\\"contact\\":\\"+919007055904\\",\\"notes\\":[],\\"fee\\":524,\\"tax\\":0,\\"error_code\\":null,\\"error_description\\":null,\\"error_source\\":null,\\"error_step\\":null,\\"error_reason\\":null,\\"acquirer_data\\":{\\"auth_code\\":\\"507935\\"},\\"created_at\\":1750692809,\\"reward\\":null,\\"base_amount\\":26200}}},\\"created_at\\":1750692815}"	2025-06-23 15:33:36.167	cmc99acem000el70uae5ac1bn
cmcg6gr6r0003ov1v44wmtqua	QmbZvA5OPPvQNU	Razorpay	payment.captured	"{\\"entity\\":\\"event\\",\\"account_id\\":\\"acc_QViyeXMhERgjlQ\\",\\"event\\":\\"payment.captured\\",\\"contains\\":[\\"payment\\"],\\"payload\\":{\\"payment\\":{\\"entity\\":{\\"id\\":\\"pay_QmbZt1gSXCHbmQ\\",\\"entity\\":\\"payment\\",\\"amount\\":32300,\\"currency\\":\\"INR\\",\\"status\\":\\"captured\\",\\"order_id\\":\\"order_QmbZYfSGhmVZCd\\",\\"invoice_id\\":null,\\"international\\":false,\\"method\\":\\"upi\\",\\"amount_refunded\\":0,\\"refund_status\\":null,\\"captured\\":true,\\"description\\":\\"Amazing Location - A short walk to Adventure! booking for 1 nights\\",\\"card_id\\":null,\\"bank\\":null,\\"wallet\\":null,\\"vpa\\":\\"success@razorpay\\",\\"email\\":\\"imsouveek@gmail.com\\",\\"contact\\":\\"+919007055904\\",\\"notes\\":[],\\"fee\\":762,\\"tax\\":116,\\"error_code\\":null,\\"error_description\\":null,\\"error_source\\":null,\\"error_step\\":null,\\"error_reason\\":null,\\"acquirer_data\\":{\\"rrn\\":\\"800283206613\\",\\"upi_transaction_id\\":\\"10E9A33F4ABF98741833259971EE039F\\"},\\"created_at\\":1751111314,\\"reward\\":null,\\"upi\\":{\\"vpa\\":\\"success@razorpay\\"},\\"base_amount\\":32300}}},\\"created_at\\":1751111315}"	2025-06-28 11:48:36.387	cmcg6g9ip0001ov1vbpiyqrv7
cmcyg1vjv0003pj0uroa0ctcv	QrfD91fp9Y39sd	Razorpay	payment.captured	"{\\"entity\\":\\"event\\",\\"account_id\\":\\"acc_QViyeXMhERgjlQ\\",\\"event\\":\\"payment.captured\\",\\"contains\\":[\\"payment\\"],\\"payload\\":{\\"payment\\":{\\"entity\\":{\\"id\\":\\"pay_QrfD6jpmP5LahP\\",\\"entity\\":\\"payment\\",\\"amount\\":64600,\\"currency\\":\\"INR\\",\\"status\\":\\"captured\\",\\"order_id\\":\\"order_QrfBXB99PxvKSm\\",\\"invoice_id\\":null,\\"international\\":false,\\"method\\":\\"upi\\",\\"amount_refunded\\":0,\\"refund_status\\":null,\\"captured\\":true,\\"description\\":\\"Amazing Location - A short walk to Adventure! booking for 2 nights\\",\\"card_id\\":null,\\"bank\\":null,\\"wallet\\":null,\\"vpa\\":\\"success@razorpay\\",\\"email\\":\\"imsouveek@gmail.com\\",\\"contact\\":\\"+919007055904\\",\\"notes\\":[],\\"fee\\":1524,\\"tax\\":232,\\"error_code\\":null,\\"error_description\\":null,\\"error_source\\":null,\\"error_step\\":null,\\"error_reason\\":null,\\"acquirer_data\\":{\\"rrn\\":\\"904194309106\\",\\"upi_transaction_id\\":\\"021C2C601DF9A3F3EB476D058F8B7F11\\"},\\"created_at\\":1752215807,\\"reward\\":null,\\"upi\\":{\\"vpa\\":\\"success@razorpay\\"},\\"base_amount\\":64600}}},\\"created_at\\":1752215808}"	2025-07-11 06:36:49.531	cmcyfzvi40001pj0untm7zb4a
cmczul3hw0003pj2bzpb065nc	Qs3JROqjH1j46f	Razorpay	payment.captured	"{\\"entity\\":\\"event\\",\\"account_id\\":\\"acc_QViyeXMhERgjlQ\\",\\"event\\":\\"payment.captured\\",\\"contains\\":[\\"payment\\"],\\"payload\\":{\\"payment\\":{\\"entity\\":{\\"id\\":\\"pay_Qs3JPO7cTlzePQ\\",\\"entity\\":\\"payment\\",\\"amount\\":32300,\\"currency\\":\\"INR\\",\\"status\\":\\"captured\\",\\"order_id\\":\\"order_Qs3JCHTj7FGSzF\\",\\"invoice_id\\":null,\\"international\\":false,\\"method\\":\\"upi\\",\\"amount_refunded\\":0,\\"refund_status\\":null,\\"captured\\":true,\\"description\\":\\"Amazing Location - A short walk to Adventure! booking for 1 nights\\",\\"card_id\\":null,\\"bank\\":null,\\"wallet\\":null,\\"vpa\\":\\"success@razorpay\\",\\"email\\":\\"imsouveek@gmail.com\\",\\"contact\\":\\"+919007055904\\",\\"notes\\":[],\\"fee\\":762,\\"tax\\":116,\\"error_code\\":null,\\"error_description\\":null,\\"error_source\\":null,\\"error_step\\":null,\\"error_reason\\":null,\\"acquirer_data\\":{\\"rrn\\":\\"369771649705\\",\\"upi_transaction_id\\":\\"06943AA25E2C218B54AE2CB954E93EE5\\"},\\"created_at\\":1752300683,\\"reward\\":null,\\"upi\\":{\\"vpa\\":\\"success@razorpay\\"},\\"base_amount\\":32300}}},\\"created_at\\":1752300684}"	2025-07-12 06:11:27.092	cmczukqdn0001pj2bu2monf9l
\.


--
-- Data for Name: _prisma_migrations; Type: TABLE DATA; Schema: public; Owner: sobo
--

COPY public._prisma_migrations (id, checksum, finished_at, migration_name, logs, rolled_back_at, started_at, applied_steps_count) FROM stdin;
\.


--
-- Name: Gateway Gateway_pkey; Type: CONSTRAINT; Schema: public; Owner: sobo
--

ALTER TABLE ONLY public."Gateway"
    ADD CONSTRAINT "Gateway_pkey" PRIMARY KEY (id);


--
-- Name: Order Order_pkey; Type: CONSTRAINT; Schema: public; Owner: sobo
--

ALTER TABLE ONLY public."Order"
    ADD CONSTRAINT "Order_pkey" PRIMARY KEY (id);


--
-- Name: Razorpay Razorpay_pkey; Type: CONSTRAINT; Schema: public; Owner: sobo
--

ALTER TABLE ONLY public."Razorpay"
    ADD CONSTRAINT "Razorpay_pkey" PRIMARY KEY (id);


--
-- Name: WebhookEvent WebhookEvent_pkey; Type: CONSTRAINT; Schema: public; Owner: sobo
--

ALTER TABLE ONLY public."WebhookEvent"
    ADD CONSTRAINT "WebhookEvent_pkey" PRIMARY KEY (id);


--
-- Name: _prisma_migrations _prisma_migrations_pkey; Type: CONSTRAINT; Schema: public; Owner: sobo
--

ALTER TABLE ONLY public._prisma_migrations
    ADD CONSTRAINT _prisma_migrations_pkey PRIMARY KEY (id);


--
-- Name: Order_bookingId_key; Type: INDEX; Schema: public; Owner: sobo
--

CREATE UNIQUE INDEX "Order_bookingId_key" ON public."Order" USING btree ("bookingId");


--
-- Name: Order_gatewayId_key; Type: INDEX; Schema: public; Owner: sobo
--

CREATE UNIQUE INDEX "Order_gatewayId_key" ON public."Order" USING btree ("gatewayId");


--
-- Name: Razorpay_gatewayId_key; Type: INDEX; Schema: public; Owner: sobo
--

CREATE UNIQUE INDEX "Razorpay_gatewayId_key" ON public."Razorpay" USING btree ("gatewayId");


--
-- Name: WebhookEvent_eventId_key; Type: INDEX; Schema: public; Owner: sobo
--

CREATE UNIQUE INDEX "WebhookEvent_eventId_key" ON public."WebhookEvent" USING btree ("eventId");


--
-- Name: Order Order_gatewayId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: sobo
--

ALTER TABLE ONLY public."Order"
    ADD CONSTRAINT "Order_gatewayId_fkey" FOREIGN KEY ("gatewayId") REFERENCES public."Gateway"(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: Razorpay Razorpay_gatewayId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: sobo
--

ALTER TABLE ONLY public."Razorpay"
    ADD CONSTRAINT "Razorpay_gatewayId_fkey" FOREIGN KEY ("gatewayId") REFERENCES public."Gateway"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: SCHEMA public; Type: ACL; Schema: -; Owner: sobo
--

REVOKE USAGE ON SCHEMA public FROM PUBLIC;


--
-- PostgreSQL database dump complete
--


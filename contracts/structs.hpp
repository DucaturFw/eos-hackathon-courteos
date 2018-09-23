#pragma once

#include <eosiolib/eosio.hpp>
#include <eosiolib/symbol.hpp>
#include <eosiolib/asset.hpp>

using namespace eosio;
using boost::container::flat_map;


enum class AgreementType {
    ATTACHED,
    CREATED
};

enum class AgreementState {
    PENDING,
    SIGNED,
    REALIZED,
    DISPUTED,
    RESOLVED
};


struct arbiter {

    account_name account;


    auto primary_key() const { return account; }

    EOSLIB_SERIALIZE(arbiter, (account))
};


struct agreement {

    uint64_t id;

    account_name initiator;
    account_name partner;
    std::vector<account_name> arbiters;
    AgreementType type;
    AgreementState state;

    std::string signed_data;
    signature initiator_sign;
    signature partner_sign;

    // File containing attached agreement
    std::string file;

    // ID of the suit in case of generated agreement
    uint64_t suit_id;

    std::vector<uint64_t> decisions;


    auto primary_key() const { return id; }

    EOSLIB_SERIALIZE(agreement, (id)(initiator)(partner)(arbiters)(type)(state)(signed_data)(initiator_sign)(partner_sign)(file)(suit_id))
};


struct suit {

    uint64_t id;

    account_name client;
    account_name executor;

    // Suit details
    std::string subject;
    uint64_t value;
    uint32_t life_time;
    
    // Arbiters fee
    uint64_t fee; // 10^6 means 100% fee
    

    auto primary_key() const { return id; }

    EOSLIB_SERIALIZE(suit, (id)(client)(executor)(subject)(value)(life_time)(fee))
};
